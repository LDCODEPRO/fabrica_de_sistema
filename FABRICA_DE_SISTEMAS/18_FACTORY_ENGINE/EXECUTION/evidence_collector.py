class EvidenceCollector:
    def collect(self, task: dict, result: dict) -> dict:
        return {
            "task_id": task["id"],
            "evidence_type": "LOG_EXECUTION",
            "payload": result
        }
