import sys
import os

# Ajuste de path para que possamos importar os modulos da V005 original (provider_router)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import provider_router as router
from tools_registry import ToolRegistry
from reasoning_engine import Reasoner

class BaseAgent:
    def __init__(self, name, role, goal):
        self.name = name
        self.role = role
        self.goal = goal
        self.tools = ToolRegistry()
        # O motor da IA usa as chaves LLM que já estão configuradas no .env da raiz
        self.engine = Reasoner(router, self.tools)

    def get_system_prompt(self):
        return f"Você é {self.name}, o agente de {self.role}. Seu objetivo máximo é: {self.goal}."

    def execute_mission(self, objective_description):
        print(f"\n--- [AGENTIC_CORE] Iniciando missao com Agente: {self.name} ---")
        print(f"Objetivo: {objective_description}")
        
        result = self.engine.run_react_loop(
            system_prompt=self.get_system_prompt(),
            user_objective=objective_description,
            max_steps=5
        )
        
        print("\n=== RESUMO DA OPERAÇÃO ===")
        print(f"Status: {result.get('status')}")
        if result.get('final_answer'):
            print(f"Resposta Final do Agente:\n{result.get('final_answer')}")
        else:
            print("O agente não chegou a uma conclusão clara ou deu erro no loop.")
            
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
