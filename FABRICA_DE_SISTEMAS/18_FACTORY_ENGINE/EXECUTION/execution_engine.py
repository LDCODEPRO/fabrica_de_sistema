import time
from .mission_runner import MissionRunner
from .status_tracker import StatusTracker
from .artifact_manager import ArtifactManager
from .evidence_collector import EvidenceCollector

class ExecutionEngine:
    def __init__(self):
        self.runner = MissionRunner()
        self.tracker = StatusTracker()
        self.artifact_mgr = ArtifactManager()
        self.evidence_collector = EvidenceCollector()

    def execute_task(self, task: dict) -> dict:
        self.tracker.update_status(task["id"], "EM_EXECUCAO")
        
        # Simula/Executa a tarefa chamando o LLM via runner
        result = self.runner.run(task)
        
        # Coleta evidências e gera artefato
        self.evidence_collector.collect(task, result)
        self.artifact_mgr.save_artifact(task, result)
        
        self.tracker.update_status(task["id"], "VALIDACAO")
        
        return {
            "task_id": task["id"],
            "status": "VALIDACAO",
            "result_summary": result.get("summary", "OK")
        }
