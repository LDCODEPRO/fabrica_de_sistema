from repositories.core_repositories import ProjectRepository
from database_manager import DatabaseManager

class ProjectService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = ProjectRepository(db_manager)

    def create_project(self, name: str, description: str, client: str, priority: str):
        return self.repo.create({
            "name": name,
            "description": description,
            "client": client,
            "priority": priority,
            "status": "ACTIVE"
        })

    def get_project(self, project_id: str):
        return self.repo.get_by_id(project_id)
        
    def list_projects(self):
        return self.repo.list()
