import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
import importlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import using importlib due to numeric folder names
database_module = importlib.import_module("20_OPERATIONAL_CORE.05_DATABASE.database")
Base = database_module.Base
get_db = database_module.get_db

engine_module = importlib.import_module("20_OPERATIONAL_CORE.01_MISSION_ENGINE.mission_engine")
MissionEngine = engine_module.MissionEngine

orch_module = importlib.import_module("20_OPERATIONAL_CORE.02_ORCHESTRATOR.orchestrator")
Orchestrator = orch_module.Orchestrator

main_api = importlib.import_module("20_OPERATIONAL_CORE.04_KNOWLEDGE_API.main")
app = main_api.app

# Setup in-memory DB for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "healthy"

def test_mission_engine(db):
    engine_obj = MissionEngine(db)
    mission = engine_obj.create_mission("Test Mission", "Implement login UI")
    assert mission.status == "PENDING"
    
    engine_obj.queue_mission(mission.id)
    db.refresh(mission)
    assert mission.status == "QUEUED"

def test_orchestrator(db):
    mission_engine = MissionEngine(db)
    mission = mission_engine.create_mission("Orch Test", "Design system tokens")
    mission_engine.queue_mission(mission.id)
    
    orch = Orchestrator(db)
    # The workflow router should map "Design" to DESIGNER
    result = orch.process_mission(mission.id)
    assert "[DESIGNER]" in result
    
    db.refresh(mission)
    assert mission.status == "COMPLETED"

def test_knowledge_api_query():
    response = client.post("/query", json={"query": "What is the observer pattern?"})
    assert response.status_code == 200
    assert "id" in response.json()["data"]
    assert response.json()["source"] == "LLM_CACHE"
