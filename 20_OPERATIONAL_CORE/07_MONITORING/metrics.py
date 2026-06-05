from sqlalchemy.orm import Session
from sqlalchemy import func
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission'])
Mission = models.Mission, Agent, KnowledgeQuery

class MetricsCollector:
    def __init__(self, db: Session):
        self.db = db

    def get_core_metrics(self) -> dict:
        total_missions = self.db.query(func.count(Mission.id)).scalar()
        failed_missions = self.db.query(func.count(Mission.id)).filter(Mission.status == "FAILED").scalar()
        active_agents = self.db.query(func.count(Agent.id)).filter(Agent.status == "WORKING").scalar()
        knowledge_queries = self.db.query(func.count(KnowledgeQuery.id)).scalar()

        return {
            "missions_executed": total_missions,
            "missions_failed": failed_missions,
            "active_agents": active_agents,
            "knowledge_queries": knowledge_queries,
            "memory_usage_mb": 0,  # Simulated system metric
            "avg_execution_time_sec": 0  # To be implemented using start/end timestamps
        }
