from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission', 'AuditLog'])
Mission = models.Mission
AuditLog = models.AuditLog

class MissionRegistry:
    def __init__(self, db: Session):
        self.db = db

    def create_mission(self, title: str, description: str) -> Mission:
        mission = Mission(title=title, description=description, status="PENDING")
        self.db.add(mission)
        self.db.commit()
        self.db.refresh(mission)
        
        log = AuditLog(event_type="MISSION_CREATED", details=f"Mission {mission.id} '{title}' created.")
        self.db.add(log)
        self.db.commit()
        
        return mission

    def get_mission(self, mission_id: int) -> Mission:
        return self.db.query(Mission).filter(Mission.id == mission_id).first()
