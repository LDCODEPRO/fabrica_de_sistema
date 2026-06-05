import logging
from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['AuditLog'])
AuditLog = models.AuditLog

# Setup disk logger
logger = logging.getLogger("audit_trail")
logger.setLevel(logging.INFO)
fh = logging.FileHandler("nexus_audit.log")
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)

class AuditTrail:
    def __init__(self, db: Session):
        self.db = db

    def record(self, event_type: str, details: str):
        # 1. Disk log
        logger.info(f"[{event_type}] {details}")
        
        # 2. Database log
        db_log = AuditLog(event_type=event_type, details=details)
        self.db.add(db_log)
        self.db.commit()
