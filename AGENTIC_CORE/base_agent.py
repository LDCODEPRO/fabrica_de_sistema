import sys
import os

# Path: raiz (provider_router) e o próprio diretório (tools/reasoning/profiles/memory)
_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
for _p in (_ROOT, _HERE):
    if _p not in sys.path:
        sys.path.append(_p)

import provider_router as router
from tools_registry import ToolRegistry
from reasoning_engine import Reasoner
import agent_profiles
import agent_memory

class BaseAgent:
    def __init__(self, name, role, goal, profile_key=None, context=None):
        self.name = name
        self.role = role
        self.goal = goal
        self.profile_key = profile_key or name
        self.context = context or {}
        try:
            _canon = agent_profiles.resolve_profile(self.profile_key)[0]
        except Exception:
            _canon = None
        self.tools = ToolRegistry(self.context, role=_canon)
        # O motor da IA usa as chaves LLM que já estão configuradas no .env da raiz
        self.engine = Reasoner(router, self.tools)

    def get_system_prompt(self):
        # Persona de elite + doutrina + memória real de aprendizado deste papel
        try:
            mem = agent_memory.memory_block(self.profile_key, limit=5)
            return agent_profiles.build_system_prompt(
                self.profile_key, memory_block=mem,
                extra=f"Objetivo máximo desta missão: {self.goal}")
        except Exception:
            return f"Você é {self.name}, agente de {self.role}. Objetivo: {self.goal}. Responda em português."

    def execute_mission(self, objective_description):
        print(f"\n--- [AGENTIC_CORE] Iniciando missao com Agente: {self.name} ---")
        print(f"Objetivo: {objective_description}")
        
        result = self.engine.run_react_loop(
            system_prompt=self.get_system_prompt(),
            user_objective=objective_description,
            max_steps=10
        )
        
        print("\n=== RESUMO DA OPERAÇÃO ===")
        print(f"Status: {result.get('status')}")
        if result.get('final_answer'):
            print(f"Resposta Final do Agente:\n{result.get('final_answer')}")
        else:
            print("O agente não chegou a uma conclusão clara ou deu erro no loop.")

        # APRENDIZADO: grava um resumo real desta execução para evoluir nas próximas
        try:
            ans = (result.get('final_answer') or result.get('status') or '')[:200]
            agent_memory.add_learning(
                self.profile_key,
                f"Objetivo: {str(objective_description)[:120]} | Resultado: {ans}",
                kind="mission")
        except Exception:
            pass

        return result

if __name__ == "__main__":
    # Teste de Inicialização do Cérebro
    print("Iniciando boot do AGENTIC_CORE...")
    agente_teste = BaseAgent(
        name="T-800",
        role="Seguranca e Inspecao de Fabrica",
        goal="Verificar a base de dados da matriz e garantir a verdade."
    )
    
    # O agente deve usar a ferramenta "buscar_informacao" e depois relatar que terminou.
    agente_teste.execute_mission("Qual é o estado do banco de dados nexus.db hoje?")
