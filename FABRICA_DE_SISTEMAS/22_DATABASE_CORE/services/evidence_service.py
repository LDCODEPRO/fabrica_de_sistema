from repositories.core_repositories import EvidenceRepository
from database_manager import DatabaseManager

class EvidenceService:
    def __init__(self, db_manager: DatabaseManager):
        self.repo = EvidenceRepository(db_manager)

    def log_evidence(self, mission_id: str, agent_id: str, evidence_type: str, file_path: str):
        return self.repo.create({
            "mission_id": mission_id,
            "agent_id": agent_id,
            "evidence_type": evidence_type,
            "file_path": file_path
        })
