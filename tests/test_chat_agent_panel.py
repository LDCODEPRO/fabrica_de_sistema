import sys
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from forja_os_server import app, get_db
import _compat_models as m

client = TestClient(app)

def test_chat_agent_endpoint_responds():
    response = client.post("/api/chat/message", json={
        "message": "Olá, o que você faz?",
        "agent_key": "communication"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["agent"] == "COMMUNICATION_AGENT"
    assert "message" in data
    assert "provider_used" in data
    assert data["status"] == "ok"
    assert "created_at" in data

    # Valida no banco se as msgs foram salvas
    from _compat_db import SessionLocal
    db = SessionLocal()
    
    # Busca a sessao
    session = db.query(m.ChatSession).filter(m.ChatSession.session_key == data["session_id"]).first()
    assert session is not None
    
    # Busca mensagens
    messages = db.query(m.ChatMessage).filter(m.ChatMessage.session_key == data["session_id"]).all()
    assert len(messages) >= 2
    
    senders = [msg.sender for msg in messages]
    assert "USER" in senders
    assert "AGENT" in senders
    
    db.close()
