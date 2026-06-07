import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
from pathlib import Path

# Configurações de importação e banco de testes
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "17_RUNTIME" / "auth"))

os.environ["FORJA_AUTH_REQUIRED"] = "true"
os.environ["FORJA_JWT_SECRET"] = "test-secret"

from forja_os_server import app
from _compat_db import Base, get_db
from password_service import get_password_hash
from scripts.expand_db_auth import expand_db_auth

# Força o uso do test DB nativo
SQLALCHEMY_DATABASE_URL = "sqlite:///test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
import _compat_db
_compat_db.SessionLocal = TestingSessionLocal
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    import sqlite3
    if os.path.exists("test.db"):
        os.remove("test.db")
    
    # Criamos o banco base
    Base.metadata.create_all(bind=engine)
    
    # Expandimos o Auth no db de teste
    # Precisamos injetar as tabelas manualmente pois expand_db_auth pega nexus.db hardcoded, 
    # então criamos as tabelas na mão aqui.
    db = TestingSessionLocal()
    for stmt in import_schema_sql():
        db.execute(stmt)
    db.commit()

    # Criação do Admin
    pwd_hash = get_password_hash("admin123")
    from sqlalchemy import text
    db.execute(
        text("INSERT INTO users (id, email, password_hash, status) VALUES (1, 'admin@forja.local', :pwd, 'ACTIVE')"),
        {"pwd": pwd_hash}
    )
    db.execute(text("INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'ADMIN')"))
    db.execute(text("INSERT INTO user_roles (user_id, role_id) VALUES (1, 1)"))
    db.commit()
    db.close()

    yield
    engine.dispose()
    if os.path.exists("test.db"):
        try:
            os.remove("test.db")
        except Exception:
            pass

def import_schema_sql():
    from sqlalchemy import text
    sql_script = """
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, status TEXT DEFAULT 'ACTIVE', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS permissions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS user_roles (user_id INTEGER NOT NULL, role_id INTEGER NOT NULL, assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, role_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS role_permissions (role_id INTEGER NOT NULL, permission_id INTEGER NOT NULL, PRIMARY KEY (role_id, permission_id), FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE, FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, jti TEXT UNIQUE NOT NULL, ip_address TEXT, user_agent TEXT, is_revoked BOOLEAN DEFAULT 0, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS refresh_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT UNIQUE NOT NULL, is_revoked BOOLEAN DEFAULT 0, expires_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS access_audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, event_type TEXT NOT NULL, ip_address TEXT, user_agent TEXT, status TEXT NOT NULL, source TEXT NOT NULL, metadata_json TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL);
    """
    return [text(s.strip() + ";") for s in sql_script.split(";") if s.strip()]

def test_login_success():
    response = client.post("/api/auth/login", json={"email": "admin@forja.local", "password": "admin123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    response = client.post("/api/auth/login", json={"email": "admin@forja.local", "password": "wrong"})
    assert response.status_code == 401

def test_access_protected_route_without_token():
    response = client.get("/api/missions")
    assert response.status_code == 401
    assert "Token ausente" in response.json()["detail"] or "invalido" in response.json()["detail"]

def test_access_protected_route_with_token():
    login_resp = client.post("/api/auth/login", json={"email": "admin@forja.local", "password": "admin123"})
    token = login_resp.json()["access_token"]
    response = client.get("/api/missions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
