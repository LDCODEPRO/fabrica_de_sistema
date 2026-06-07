import os
import sys

# Ensure 22_DATABASE_CORE is in path
db_core_path = os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE")
if db_core_path not in sys.path:
    sys.path.append(db_core_path)

from database_manager import DatabaseManager
from repositories.core_repositories import (
    ProjectRepository, 
    MissionRepository, 
    AgentRepository,
    LLMRepository,
    EvidenceRepository,
    AuditRepository,
    BillingRepository,
    TaskRepository
)

DB_PATH = os.path.join(db_core_path, "fabricadb.sqlite")
db_manager = DatabaseManager(db_path=DB_PATH)

def get_db():
    return db_manager

def get_project_repo():
    return ProjectRepository(db_manager)

def get_mission_repo():
    return MissionRepository(db_manager)

def get_task_repo():
    return TaskRepository(db_manager)

def get_agent_repo():
    return AgentRepository(db_manager)

def get_llm_repo():
    return LLMRepository(db_manager)

def get_audit_repo():
    return AuditRepository(db_manager)

def get_evidence_repo():
    return EvidenceRepository(db_manager)

def get_billing_repo():
    return BillingRepository(db_manager)
