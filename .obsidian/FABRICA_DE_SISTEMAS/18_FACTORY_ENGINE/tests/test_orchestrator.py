import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from ORCHESTRATOR.auto_orchestrator import AutoOrchestrator

def test_auto_orchestrator():
    orch = AutoOrchestrator()
    blueprint = "TEST_BLUEPRINT"
    project_id = "p-123"
    result = orch.orchestrate(blueprint, project_id)
    
    assert len(result["missions"]) == 3
    assert len(result["tasks"]) > 0
    assert "MISSION BOARD" in result["board"]
