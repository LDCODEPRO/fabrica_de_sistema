from sqlalchemy.orm import Session
from .mission_registry import MissionRegistry
from .mission_state_manager import MissionStateManager
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])
Mission = models.Mission
AuditLog = models.AuditLog

class MissionEngine:
    def __init__(self, db: Session):
        self.db = db
        self.registry = MissionRegistry(db)
        self.state_manager = MissionStateManager(db)

    def create_mission(self, title: str, description: str):
        return self.registry.create_mission(title, description)

    def queue_mission(self, mission_id: int):
        return self.state_manager.change_state(mission_id, "QUEUED")

    def start_mission(self, mission_id: int):
        return self.state_manager.change_state(mission_id, "RUNNING")

    def pause_mission(self, mission_id: int, reason: str = ""):
        return self.state_manager.change_state(mission_id, "PAUSED", details=reason)

    def complete_mission(self, mission_id: int):
        return self.state_manager.change_state(mission_id, "COMPLETED")

    def fail_mission(self, mission_id: int, error: str):
        return self.state_manager.change_state(mission_id, "FAILED", details=error)

    def cancel_mission(self, mission_id: int, reason: str = ""):
        return self.state_manager.change_state(mission_id, "CANCELLED", details=reason)

    def register_evidence(self, mission_id: int, description: str, file_path: str = None):
        models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["Evidence"])
        Evidence = models.Evidence
        mission = self.registry.get_mission(mission_id)
        if not mission:
            raise ValueError("Mission not found")
            
        evidence = Evidence(mission_id=mission_id, description=description, file_path=file_path)
        self.db.add(evidence)
        
        log = AuditLog(event_type="EVIDENCE_REGISTERED", details=f"Evidence for mission {mission_id}: {description}")
        self.db.add(log)
        self.db.commit()
        return evidence
