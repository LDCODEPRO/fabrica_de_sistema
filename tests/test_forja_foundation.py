import os
import sys
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

# Add root project path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Import core modules
import provider_router
from _compat_db import init_db, get_db
import _compat_models as models
from forja_os_server import app

client = TestClient(app)

def test_database_initialization():
    """Testa se o SQLite é gerado e contém as tabelas compatíveis essenciais"""
    init_db()
    db_path = project_root / "nexus.db"
    assert db_path.exists(), "nexus.db database does not exist"
    
    # Valida tabelas essenciais
    db = next(get_db())
    mission_count = db.query(models.Mission).count()
    assert isinstance(mission_count, int)

def test_provider_router_registry():
    """Valida se as configurações e fallback de providers operam de modo estruturado e seguro"""
    assert hasattr(provider_router, 'PREFERRED_ORDER'), "Provider fallback order not defined"
    assert "openrouter" in provider_router.PROVIDER_CONFIG
    assert provider_router.provider_status("inexistent_provider") == "DESCONHECIDO"

def test_fastapi_health_endpoint():
    """Garante que a saúde do FastAPI está real e não-mockada"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "forja-os"
    assert "timestamp" in data

def test_fastapi_status_zero_ghost_law():
    """Valida a Zero Ghost Law: rotas ausentes de dados devem expor a ausência transparentemente"""
    response = client.get("/api/panel/truth-status")
    assert response.status_code == 200
    data = response.json()
    
    # Verifica que o Truth Status rotula dados inexistentes como 'NÃO MONITORADO' ou similar, nunca inventa.
    projects_card = next(card for card in data["cards"] if card["card"] == "projects")
    assert projects_card["source"] == "sem_dados_reais"

def test_provider_router_no_keys_leak():
    """O status do provider router NUNCA deve cuspir as chaves (API Keys) de volta, por segurança"""
    status_response = provider_router.provider_status("openrouter")
    assert "key" not in status_response.lower()
    assert status_response in ["CONFIGURADO", "AUSENTE"]
