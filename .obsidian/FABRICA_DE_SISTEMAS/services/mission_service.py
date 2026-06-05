from repositories.core_repositories import MissionRepository
from database_manager import DatabaseManager

class MissionService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = MissionRepository(db_manager)

    def create_mission(self, project_id: str, name: str, goal: str):
        return self.repo.create({
            "project_id": project_id,
            "name": name,
            "goal": goal,
            "status": "PENDING"
        })

    def list_project_missions(self, project_id: str):
        return self.repo.list({"project_id": project_id})
