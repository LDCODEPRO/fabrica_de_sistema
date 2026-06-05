from repositories.core_repositories import AgentRepository
from database_manager import DatabaseManager

class AgentService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = AgentRepository(db_manager)

    def register_agent(self, name: str, role: str):
        return self.repo.create({
            "name": name,
            "role": role,
            "status": "ACTIVE"
        })

    def list_active_agents(self):
        return self.repo.list({"status": "ACTIVE"})
