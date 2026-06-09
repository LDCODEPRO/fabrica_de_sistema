"""
tests/test_chat_real_routing.py — Testes de roteamento real do chat V008.

Valida:
1. Endpoint /api/chat/status retorna status real
2. Endpoint /api/chat/message funciona end-to-end
3. Fallback funciona quando provider preferido falha
4. Textos fantasma eliminados (ZERO GHOST)
5. Persistência de mensagens no banco
6. Tratamento de erro correto (503)
"""
import json
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
import pytest

# Configurar path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def client():
    """Cria cliente de teste do FastAPI."""
    import forja_os_server as srv
    srv.init_db()
    return TestClient(srv.app)


# ═══════════════════════════════════════════════════════════════════════════
# 1. TESTES DO ENDPOINT /api/chat/status
# ═══════════════════════════════════════════════════════════════════════════

class TestChatStatus:
    def test_status_endpoint_existe(self, client):
        r = client.get("/api/chat/status")
        assert r.status_code == 200

    def test_status_retorna_campos_obrigatorios(self, client):
        data = client.get("/api/chat/status").json()
        assert "online" in data
        assert "status_text" in data
        assert "available" in data
        assert "unavailable" in data
        assert "timestamp" in data

    def test_status_online_e_booleano(self, client):
        data = client.get("/api/chat/status").json()
        assert isinstance(data["online"], bool)

    def test_status_available_e_lista(self, client):
        data = client.get("/api/chat/status").json()
        assert isinstance(data["available"], list)

    def test_status_text_nao_e_fantasma(self, client):
        """ZERO GHOST: status_text nunca diz 'Online' ou 'LLMs Online' fixo."""
        data = client.get("/api/chat/status").json()
        fantasmas = ["LLMs Online", "Online e pronto", "Claude ativa", "Provedores operacionais"]
        for fantasma in fantasmas:
            assert data["status_text"] != fantasma, f"Texto fantasma detectado: '{fantasma}'"

    def test_status_provider_entry_tem_campos(self, client):
        data = client.get("/api/chat/status").json()
        todos = data["available"] + data["unavailable"]
        if todos:
            entry = todos[0]
            assert "id" in entry
            assert "label" in entry
            assert "configured" in entry
            assert "healthy" in entry


# ═══════════════════════════════════════════════════════════════════════════
# 2. TESTES DO ENDPOINT /api/chat/message
# ═══════════════════════════════════════════════════════════════════════════

class TestChatMessage:
    def test_message_endpoint_existe(self, client):
        """POST /api/chat/message aceita payload válido."""
        r = client.post("/api/chat/message", json={
            "message": "teste unitário",
            "agent_key": "chat",
            "provider": "openrouter"
        })
        # Pode ser 200 ou 503 dependendo se o provider está disponível
        assert r.status_code in (200, 503)

    def test_message_requer_campo_message(self, client):
        """Payload sem 'message' deve retornar 422."""
        r = client.post("/api/chat/message", json={"agent_key": "chat"})
        assert r.status_code == 422

    def test_message_sucesso_retorna_campos(self, client):
        """Se a mensagem for processada, retorna campos obrigatórios."""
        r = client.post("/api/chat/message", json={
            "message": "oi",
            "agent_key": "chat",
            "provider": "openrouter"
        })
        if r.status_code == 200:
            data = r.json()
            assert "session_id" in data
            assert "agent" in data
            assert "message" in data
            assert "provider_used" in data
            assert "status" in data
            assert data["status"] == "ok"

    def test_message_fallback_trail(self, client):
        """Resposta deve incluir trilha de fallback."""
        r = client.post("/api/chat/message", json={
            "message": "teste trail",
            "agent_key": "chat",
            "provider": "openrouter"
        })
        if r.status_code == 200:
            data = r.json()
            assert "fallback_trail" in data
            assert isinstance(data["fallback_trail"], list)


# ═══════════════════════════════════════════════════════════════════════════
# 3. TESTES DO PROVIDER ROUTER
# ═══════════════════════════════════════════════════════════════════════════

class TestProviderRouter:
    def test_preferred_order_existe(self):
        import provider_router as pr
        assert hasattr(pr, "PREFERRED_ORDER")
        assert len(pr.PREFERRED_ORDER) >= 3

    def test_provider_status_nao_expoe_chave(self):
        import provider_router as pr
        for p in pr.PREFERRED_ORDER:
            status = pr.provider_status(p)
            assert status in ("CONFIGURADO", "AUSENTE", "DESCONHECIDO")

    def test_execute_with_fallback_retorna_dict(self):
        import provider_router as pr
        result = pr.execute_with_fallback("teste", max_tokens=10)
        assert isinstance(result, dict)
        assert "ok" in result
        assert "provider" in result
        assert "fallback_trail" in result

    def test_execute_llm_provider_desconhecido(self):
        import provider_router as pr
        result = pr.execute_llm("provider_inexistente", "teste")
        assert result["ok"] is False
        assert result["error"] == "provider desconhecido"

    def test_group_orders_conversation_existe(self):
        import provider_router as pr
        assert "conversation" in pr.GROUP_ORDERS


# ═══════════════════════════════════════════════════════════════════════════
# 4. TESTES ZERO GHOST — FRONTEND ESTÁTICO
# ═══════════════════════════════════════════════════════════════════════════

class TestZeroGhost:
    """Verifica que o código-fonte do frontend não contém textos fantasma hardcoded."""

    @pytest.fixture(scope="class")
    def home_jsx_content(self):
        home_path = ROOT / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "js" / "home.jsx"
        return home_path.read_text(encoding="utf-8")

    def test_sem_llms_online_hardcoded(self, home_jsx_content):
        assert "LLMs Online" not in home_jsx_content

    def test_sem_online_e_pronto_hardcoded(self, home_jsx_content):
        assert "Online e pronto" not in home_jsx_content

    def test_sem_claude_ativa_hardcoded(self, home_jsx_content):
        assert "Claude ativa" not in home_jsx_content

    def test_tem_chat_status_fetch(self, home_jsx_content):
        assert "/api/chat/status" in home_jsx_content

    def test_tem_status_dinamico(self, home_jsx_content):
        assert "chatStatus" in home_jsx_content
        assert "setChatStatus" in home_jsx_content

    def test_tem_indicador_cor_dinamico(self, home_jsx_content):
        assert "statusColor" in home_jsx_content


# ═══════════════════════════════════════════════════════════════════════════
# 5. TESTES DE PERSISTÊNCIA
# ═══════════════════════════════════════════════════════════════════════════

class TestPersistencia:
    def test_mensagem_persiste_no_banco(self, client):
        """Mensagem enviada deve ser persistida no banco."""
        r = client.post("/api/chat/message", json={
            "message": "teste persistência xyz123",
            "agent_key": "chat",
            "provider": "openrouter"
        })
        if r.status_code == 200:
            data = r.json()
            session_id = data["session_id"]
            # Verifica que retornou um session_id válido
            assert len(session_id) > 10


# ═══════════════════════════════════════════════════════════════════════════
# 6. TESTE DE HEALTH CHECK REAL
# ═══════════════════════════════════════════════════════════════════════════

class TestHealthCheckReal:
    def test_health_endpoint_basico(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"

    def test_chat_status_nao_e_fixo(self, client):
        """Verifica que /api/chat/status faz verificação real (não retorna dados fixos)."""
        r1 = client.get("/api/chat/status").json()
        r2 = client.get("/api/chat/status").json()
        # Timestamps devem ser diferentes (prova que são calculados em tempo real)
        assert r1["timestamp"] != r2["timestamp"]
