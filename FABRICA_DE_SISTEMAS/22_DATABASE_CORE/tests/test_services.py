from services.project_service import ProjectService
from services.agent_service import AgentService

def test_project_service(db_manager):
    svc = ProjectService(db_manager)
    pid = svc.create_project("SaaS V1", "Core SaaS", "Internal", "HIGH")
    assert pid is not None
    
    p = svc.get_project(pid)
    assert p['name'] == "SaaS V1"

def test_agent_service(db_manager):
    svc = AgentService(db_manager)
    aid = svc.register_agent("Orchestrator", "ORCHESTRATOR_AGENT")
    assert aid is not None
    
    agents = svc.list_active_agents()
    assert len(agents) == 1
    assert agents[0]['name'] == "Orchestrator"
