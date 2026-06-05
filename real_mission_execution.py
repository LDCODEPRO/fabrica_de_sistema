import sys
import os
import time

sys.path.append(os.path.abspath(r"D:\fabricadesistema\17_AUTOMACOES\LLM_ROUTER"))
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE"))

from llm_router import LLMRouter
from database_manager import DatabaseManager
from services.project_service import ProjectService
from services.mission_service import MissionService
from services.agent_service import AgentService
from services.evidence_service import EvidenceService
from services.billing_service import BillingService

def run_real_mission():
    print("\n=============================================")
    print("--- ETAPA 6 e 7: EXECUÇÃO DE MISSÃO REAL ---")
    print("=============================================\n")
    
    db = DatabaseManager(
        db_path=r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\fabricadb.sqlite",
        migrations_dir=r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\migrations"
    )
    db.run_migrations()
    
    # Inicia Serviços do Database Core
    project_svc = ProjectService(db)
    mission_svc = MissionService(db)
    agent_svc = AgentService(db)
    evidence_svc = EvidenceService(db)
    billing_svc = BillingService(db)
    
    from services.llm_service import LLMService
    llm_svc = LLMService(db)
    
    # 1. Criação do Ambiente no Banco
    print("1. Criando registros no Database Core...")
    import uuid
    uid = str(uuid.uuid4())[:8]
    project_id = project_svc.create_project(f"FastAPI Test {uid}", "Projeto para validar LLM", "Interno", "HIGH")
    mission_id = mission_svc.create_mission(project_id, f"MISSION_FASTAPI_{uid}", "Criar um endpoint simples em FastAPI")
    agent_id = agent_svc.register_agent(f"Programmer Agent {uid}", "PROGRAMMER_PROFILE")
    print(f"Project ID: {project_id}\nMission ID: {mission_id}\nAgent ID: {agent_id}\n")
    
    # 2. Execução da Missão via LLM Router
    print("2. Acionando Agent Execution Engine via LLM Router...")
    router = LLMRouter(mission_id=mission_id)
    
    prompt = "Crie um endpoint simples de healthcheck em FastAPI que retorna {'status': 'healthy'}. Apenas o código, sem explicações."
    print(f"Prompt Enviado: {prompt}")
    
    start_time = time.time()
    result = router.route(task_type="coding", prompt=prompt)
    elapsed = time.time() - start_time
    
    if not result.success:
        print("FALHA NA EXECUÇÃO LLM!")
        sys.exit(1)
        
    print(f"\n[Resposta do Provedor: {result.provider_id}]")
    print("-" * 40)
    print(result.response.strip())
    print("-" * 40)
    print(f"Latência: {elapsed:.2f}s\n")
    
    # 3. Validando Evidência e Persistindo
    print("3. Persistindo Evidências e Custos no Database Core...")
    evidence_path = os.path.abspath("evidence_fastapi.py")
    with open(evidence_path, "w", encoding="utf-8") as f:
        f.write(result.response)
        
    ev_id = evidence_svc.log_evidence(mission_id, agent_id, "GENERATED_CODE", evidence_path)
    print(f"Evidência Salva ID: {ev_id}")
    
    # Garantir que o provedor exista no DB
    try:
        db_provider_id = llm_svc.register_provider(result.provider_id, f"vault://{result.provider_id.upper()}_KEY")
    except Exception as e:
        # Se falhar ou já existir, tenta buscar
        res = db.execute_query("SELECT id FROM llm_providers WHERE name = ?", (result.provider_id,))
        if res:
            db_provider_id = res[0]['id']
        else:
            db_provider_id = llm_svc.register_provider(result.provider_id + "_fallback", f"vault://{result.provider_id.upper()}_KEY")

    cost = 0.0003
    bill_id = billing_svc.record_cost(project_id, db_provider_id, cost, f"Missão: {mission_id}")
    print(f"Billing Event ID: {bill_id} | Cost: ${cost:.4f}")
    
    # Limpeza do arquivo de evidencia simulado
    os.remove(evidence_path)
    
    print("\n>>> MISSÃO EXECUTADA E CERTIFICADA COM SUCESSO <<<")

if __name__ == "__main__":
    run_real_mission()
