from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission'])
Mission = models.Mission

class MissionQueue:
    def __init__(self, db: Session):
        self.db = db

    def get_next_queued_mission(self) -> Mission:
        return self.db.query(Mission).filter(Mission.status == "QUEUED").order_by(Mission.created_at.asc()).first()
    
    def get_all_queued(self):
        return self.db.query(Mission).filter(Mission.status == "QUEUED").order_by(Mission.created_at.asc()).all()
