from .base_repository import BaseRepository

class ProjectRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "projects")

class MissionRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "missions")

class AgentRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "agents")

class LLMRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "llm_providers")

class EvidenceRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "evidences")

class AuditRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "audit_logs")
        
    # Audit logs usually shouldn't be softly deleted, but we respect the interface
    def delete_soft(self, entity_id: str):
        query = f"UPDATE {self.table_name} SET status = 'DELETED' WHERE id = ?"
        with self.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (entity_id,))
            conn.commit()
            return cursor.rowcount > 0

class BillingRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "billing_events")

class HealthRepository(BaseRepository):
    def __init__(self, db_manager):
        super().__init__(db_manager, "system_health")
