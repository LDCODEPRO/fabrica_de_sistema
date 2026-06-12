import re


class Reasoner:
    """
    Motor ReAct: o agente 'pensa' (Thought), escolhe uma 'Action' (ferramenta),
    observa o resultado (Observation) e repete até dar a 'Answer' final.
    Mantém o TRANSCRITO completo a cada passo (contexto real).
    """
    def __init__(self, provider_router, tools_registry):
        self.router = provider_router
        self.tools = tools_registry

    def _instructions(self, system_prompt, user_objective):
        return (
            f"{system_prompt}\n\n"
            "Você opera em um loop ReAct. A cada passo escreva UMA das opções:\n"
            "  Thought: <seu raciocínio>\n"
            "  Action: <nome_da_ferramenta>\n"
            "  ActionInput: <parâmetro> (ou vazio)\n"
            "  PAUSE\n"
            "...e PARE. O sistema executa a ferramenta e devolve 'Observation:'.\n"
            "Quando tiver a resposta final, escreva:\n"
            "  Answer: <resposta final completa em português>\n\n"
            "Ferramentas disponíveis:\n"
            f"{self.tools.get_tool_descriptions()}\n\n"
            f"Objetivo final: {user_objective}\n"
            "Comece agora (Thought/Action ou Answer)."
        )

    def run_react_loop(self, system_prompt, user_objective, max_steps=8):
        transcript = self._instructions(system_prompt, user_objective)
        steps_log = []
        invalid_streak = 0  # respostas seguidas fora do formato Thought/Action/Answer

        for step in range(max_steps):
            response = self.router.execute_with_fallback(
                prompt=transcript,
                system="Você é um motor de raciocínio ReAct. Siga o formato Thought/Action/ActionInput/PAUSE, ou Answer.",
                max_tokens=2000,
            )
            if not response.get("ok"):
                return {"status": "error", "message": response.get("error"),
                        "steps": step, "log": steps_log}

            llm_text = (response.get("response") or "").strip()
            transcript += "\n" + llm_text
            steps_log.append(llm_text)

            # 1) Resposta final?
            if "Answer:" in llm_text:
                final = llm_text.split("Answer:", 1)[1].strip()
                return {"status": "completed", "steps": step + 1,
                        "final_answer": final, "log": steps_log}

            # 2) Chamada de ferramenta?
            if "Action:" in llm_text:
                lines = llm_text.splitlines()
                action_name = ""
                for line in lines:
                    if line.strip().startswith("Action:"):
                        action_name = line.split("Action:", 1)[1].strip()
                        break
                # ActionInput pode ter MÚLTIPLAS linhas (ex.: conteúdo de arquivo)
                action_input = ""
                for i, line in enumerate(lines):
                    if line.strip().startswith("ActionInput:"):
                        buf = [line.split("ActionInput:", 1)[1]]
                        for nxt in lines[i + 1:]:
                            st = nxt.strip()
                            if st == "PAUSE" or st.startswith(("Observation", "Thought:", "Action:", "Answer")):
                                break
                            buf.append(nxt)
                        action_input = "\n".join(buf).strip()
                        break
                if action_name:
                    invalid_streak = 0
                    observation = self.tools.execute(action_name, action_input)
                    transcript += f"\nObservation: {observation}\n"
                    continue
                transcript += "\nObservation: Nenhuma ação extraída. Use 'Action:' ou 'Answer:'.\n"
                continue

            # 3) Formato inválido — orienta uma vez; na 2ª seguida, aceita o texto
            # como resposta direta. Sem isso, um pedido conversacional simples
            # ("Responda apenas X") ficava em loop até max_steps (10+ min de espera).
            invalid_streak += 1
            if invalid_streak >= 2 and llm_text:
                return {"status": "completed", "steps": step + 1,
                        "final_answer": llm_text, "log": steps_log}
            transcript += ("\nObservation: Formato inválido. Use 'Action: <ferramenta>' + 'ActionInput:' + 'PAUSE', "
                           "ou 'Answer: <resposta>'. Se já tem a resposta final, use 'Answer: <resposta>'.\n")

        # Atingiu o limite de passos: devolve o último raciocínio como resposta parcial
        last = steps_log[-1] if steps_log else ""
        return {"status": "max_steps_reached", "steps": max_steps,
                "final_answer": last, "log": steps_log}
