from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])
Mission = models.Mission
AuditLog = models.AuditLog
import datetime

class MissionStateManager:
    VALID_TRANSITIONS = {
        "PENDING": ["QUEUED", "CANCELLED"],
        "QUEUED": ["RUNNING", "CANCELLED"],
        "RUNNING": ["PAUSED", "FAILED", "COMPLETED", "CANCELLED"],
        "PAUSED": ["RUNNING", "CANCELLED"],
        "FAILED": ["PENDING"],  # Retry
        "COMPLETED": [],
        "CANCELLED": []
    }

    def __init__(self, db: Session):
        self.db = db

    def change_state(self, mission_id: int, new_state: str, details: str = "") -> bool:
        mission = self.db.query(Mission).filter(Mission.id == mission_id).first()
        if not mission:
            raise ValueError(f"Mission {mission_id} not found.")

        current_state = mission.status
        if new_state not in self.VALID_TRANSITIONS.get(current_state, []):
            raise ValueError(f"Invalid transition from {current_state} to {new_state}")

        mission.status = new_state
        
        # Log transition
        log = AuditLog(
            event_type="MISSION_STATE_CHANGE",
            details=f"Mission {mission_id} transitioned {current_state} -> {new_state}. {details}"
        )
        self.db.add(log)
        self.db.commit()
        return True
