import json

class Reasoner:
    """
    Motor ReAct Básico.
    Faz o agente 'pensar', escolher uma 'acao' (ferramenta) e observar o 'resultado'
    antes de dar a resposta final.
    """
    def __init__(self, provider_router, tools_registry):
        self.router = provider_router
        self.tools = tools_registry

    def run_react_loop(self, system_prompt, user_objective, max_steps=3):
        
        # O prompt ReAct instrui a IA a raciocinar em formato estrito
        react_prompt = f"""
{system_prompt}

Você opera em um loop de Thought, Action, PAUSE, Observation.
No final do loop, você imprime a Answer final.

1. Thought: Descreva o que você precisa fazer.
2. Action: Escolha uma ferramenta. APENAS ferramentas válidas listadas abaixo.
3. PAUSE: Pare de escrever e aguarde.
4. Observation: (O sistema retornará o resultado da ação para você).

Ferramentas disponíveis:
{self.tools.get_tool_descriptions()}

Formato EXATO para chamar a Action:
Action: nome_da_ferramenta
ActionInput: parametro1 (se houver, caso contrario deixe em branco)
PAUSE

---
Seu objetivo final é: {user_objective}
Comece!
"""
        messages = [{"role": "user", "content": react_prompt}]
        
        for step in range(max_steps):
            # Pedimos para a LLM completar
            # Passamos max_tokens pequeno porque ela tem que parar no PAUSE
            response = self.router.execute_with_fallback(
                prompt=messages[-1]["content"],
                system="Você é um motor de raciocínio. Siga estritamente o formato de Thought/Action/PAUSE.",
                max_tokens=200
            )

            if not response.get("ok"):
                return {"status": "error", "message": response.get("error")}

            llm_text = response.get("response", "")
            messages.append({"role": "assistant", "content": llm_text})

            # Analisa se a IA chamou uma ferramenta
            if "Action:" in llm_text:
                # Extrai a Action
                lines = llm_text.split('\n')
                action_name = ""
                action_input = ""
                for line in lines:
                    if line.startswith("Action:"):
                        action_name = line.replace("Action:", "").strip()
                    elif line.startswith("ActionInput:"):
                        action_input = line.replace("ActionInput:", "").strip()

                if action_name:
                    # Executa a ferramenta do nosso Python local
                    observation = self.tools.execute(action_name, action_input)
                    
                    # Devolve a observação para a IA continuar pensando
                    messages.append({"role": "user", "content": f"Observation: {observation}\nContinue com Thought ou Answer."})
                else:
                    messages.append({"role": "user", "content": "Observation: Nenhuma acao extraida. Escreva 'Answer: ' se terminou."})
            
            elif "Answer:" in llm_text or "Answer" in llm_text:
                # O agente concluiu a tarefa
                return {"status": "completed", "steps": step + 1, "final_answer": llm_text}
            
            else:
                 # Falhou em seguir o loop, força a resposta
                 messages.append({"role": "user", "content": "Observation: Formato invalido. Você deve usar 'Action: ' e 'PAUSE', ou escrever 'Answer: ' com o resultado final."})

        return {"status": "max_steps_reached", "history": messages}
