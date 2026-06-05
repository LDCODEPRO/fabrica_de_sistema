from .database import Base, engine, SessionLocal, get_db
from .models import Mission, Agent, Evidence, KnowledgeQuery, MemoryEntry, AuditLog

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
