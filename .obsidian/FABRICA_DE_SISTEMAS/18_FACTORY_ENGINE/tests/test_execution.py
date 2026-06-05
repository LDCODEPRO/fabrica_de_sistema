import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from EXECUTION.execution_engine import ExecutionEngine

def test_execution_engine():
    engine = ExecutionEngine()
    task = {"id": "t-123", "name": "Task 1", "mission_name": "M1"}
    result = engine.execute_task(task)
    
    assert result["status"] == "VALIDACAO"
    assert result["task_id"] == "t-123"
