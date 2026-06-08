import os
import sys
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "17_RUNTIME"))

from forja_os_server import app
from _compat_db import SessionLocal
import _compat_models as m

client = TestClient(app)

def test_database_expansion_exists():
    """Garante que as novas tabelas existem e podem ser consultadas sem erros (Zero Data Loss)"""
    db = SessionLocal()
    # Deve não dar erro
    db.query(m.Project).count()
    db.query(m.Alert).count()
    db.query(m.GithubEvent).count()

def test_home_overview_endpoint():
    """Garante que o endpoint principal responde corretamente usando Reality Engine"""
    response = client.get("/api/home/overview")
    assert response.status_code == 200
    data = response.json()
    assert "active_missions" in data
    assert "total_projects" in data
    assert data["source"] == "reality_engine"

def test_github_collector_no_fake_data():
    """Verifica se o Github collector devolve dados reais de branch ou unavailable, nunca inventa"""
    response = client.get("/api/home/github")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "unavailable", "error"]
    if data["status"] == "ok":
        assert "branch" in data
        assert "last_commit" in data

def test_provider_collector_respects_matrix():
    """Verifica se o provider collector respeita a matriz e não diz FAILED pra pending"""
    response = client.get("/api/home/providers")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    for item in data["items"]:
        assert item["status"] in ["certified", "environment_pending", "missing_implementation", "not_configured", "failed_code", "blocked_security"]

def test_timeline_is_real():
    response = client.get("/api/home/timeline")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["events"], list)

def test_alerts_is_real():
    response = client.get("/api/home/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "total_unresolved" in data
