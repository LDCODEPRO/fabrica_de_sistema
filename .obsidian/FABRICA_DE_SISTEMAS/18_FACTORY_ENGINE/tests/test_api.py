import sys
import os
sys.path.append(os.path.abspath(r"D:\fabricadesistema\FABRICA_DE_SISTEMAS\18_FACTORY_ENGINE"))

from fastapi.testclient import TestClient
from API.api import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "System Factory Engine is running."

def test_create_project():
    payload = {
        "idea": "Ideia teste",
        "scope": "Escopo teste",
        "objectives": "Objetivos teste",
        "timeline": "1 mes",
        "technologies": ["Python"]
    }
    response = client.post("/project/create", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_dashboard():
    response = client.get("/dashboard")
    assert response.status_code == 200
    assert "projects" in response.json()
