"""
telegram_attendant.py — Atendimento automático no Telegram (FORJA OS).

Usa o bot da Fábrica (conexão telegram global). Faz long-polling do getUpdates
(funciona local, sem URL pública) e responde cada cliente com o agente —
cordial, com memória e continuidade. Sem fingir: se o bot não estiver
conectado, fica ocioso até conectarem.
"""
import json
import time
import threading
import logging
import urllib.request
from datetime import datetime

logger = logging.getLogger("forja_os.telegram")
_started = False
_offset = None


def _get_token():
    from _compat_db import SessionLocal
    import _compat_models as m
    db = SessionLocal()
    try:
        row = (db.query(m.ClientConnection)
               .filter(m.ClientConnection.client_id == 0,
                       m.ClientConnection.kind == "telegram").first())
        if row and row.credential and row.status == "CONNECTED":
            return row.credential
        return None
    finally:
        db.close()


def _api(token, method, payload=None, timeout=35):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload).encode() if payload else None
    headers = {"Content-Type": "application/json"} if data else {}
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def _reply(chat_id, text):
    """Gera a resposta do agente para a mensagem do cliente (com memória)."""
    from _compat_db import SessionLocal
    import _compat_models as m
    import provider_router
    try:
        from AGENTIC_CORE import agent_profiles, agent_memory
    except Exception:
        agent_profiles = agent_memory = None

    session_key = f"tg-{chat_id}"
    db = SessionLocal()
    try:
        sess = db.query(m.ChatSession).filter(m.ChatSession.session_key == session_key).first()
        if not sess:
            db.add(m.ChatSession(session_key=session_key, status="OPEN")); db.commit()
        db.add(m.ChatMessage(session_key=session_key, sender="USER", content=text)); db.commit()

        hist = (db.query(m.ChatMessage).filter(m.ChatMessage.session_key == session_key)
                .order_by(m.ChatMessage.created_at.asc()).limit(12).all())
        hist_text = ""
        for msg in hist:
            who = "Usuário" if msg.sender == "USER" else "Você"
            hist_text += f"{who}: {msg.content}\n"

        cordial = ("Você é o atendente da Fábrica no Telegram. Seja CORDIAL, claro e natural. "
                   "Mantenha o contexto da conversa, lembre o que o cliente disse e dê continuidade. "
                   "Responda em português, de forma útil e objetiva.")
        if agent_profiles:
            mem = agent_memory.memory_block("COMMUNICATION", limit=5) if agent_memory else ""
            system_prompt = agent_profiles.build_system_prompt("COMMUNICATION", memory_block=mem, extra=cordial)
        else:
            system_prompt = cordial

        full = f"[HISTÓRICO]\n{hist_text}\n[MENSAGEM ATUAL]\n{text}\n"
        result = provider_router.execute_for_group("conversation", full, system=system_prompt, max_tokens=700)
        if not result.get("ok") or not result.get("response"):
            return "Desculpe, estou com instabilidade no momento. Já já retorno."
        resp = result["response"]
        db.add(m.ChatMessage(session_key=session_key, sender="communication_agent",
                             content=resp, provider_key=result.get("provider"), provider_status="CERTIFIED"))
        db.add(m.AuditLog(event_type="TELEGRAM_REPLY", details=json.dumps(
            {"chat_id": chat_id, "provider": result.get("provider")}, ensure_ascii=False)))
        db.commit()
        if agent_memory:
            try:
                agent_memory.add_learning("COMMUNICATION",
                    f"Telegram — cliente: {text[:90]} | respondi: {resp[:110]}", kind="conversa")
            except Exception:
                pass
        return resp
    finally:
        db.close()


def _loop():
    global _offset
    logger.info("FORJA OS: atendente Telegram em background iniciado.")
    while True:
        token = _get_token()
        if not token:
            time.sleep(15)
            continue
        try:
            params = {"timeout": 25}
            if _offset is not None:
                params["offset"] = _offset
            data = _api(token, "getUpdates", params, timeout=35)
            for upd in data.get("result", []):
                _offset = upd["update_id"] + 1
                msg = upd.get("message") or upd.get("edited_message")
                if not msg:
                    continue
                text = msg.get("text")
                chat_id = (msg.get("chat") or {}).get("id")
                if not text or chat_id is None:
                    continue
                try:
                    reply = _reply(chat_id, text)
                    _api(token, "sendMessage", {"chat_id": chat_id, "text": reply})
                    logger.info("telegram: respondeu chat %s", chat_id)
                except Exception as e:
                    logger.warning("telegram reply erro: %s", e)
        except Exception as e:
            logger.warning("telegram poll erro: %s", e)
            time.sleep(10)


def start_attendant():
    global _started
    if _started:
        return
    _started = True
    threading.Thread(target=_loop, daemon=True, name="forja-telegram").start()
