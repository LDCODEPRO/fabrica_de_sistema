from repositories.core_repositories import AuditRepository
from database_manager import DatabaseManager

class AuditService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = AuditRepository(db_manager)

    def log_action(self, action: str, actor: str, target_id: str):
        return self.repo.create({
            "action": action,
            "actor": actor,
            "target_id": target_id
        })
