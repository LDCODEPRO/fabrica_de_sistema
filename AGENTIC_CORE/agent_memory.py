"""
agent_memory.py — Memória de aprendizado persistente por agente (FORJA OS).

Cada agente acumula APRENDIZADOS reais (resumos do que foi feito e do que
funcionou) no nexus.db. Antes de cada execução, os aprendizados recentes são
injetados no system prompt — é o equivalente prático de "aprender sozinho"
(memória aumentada por recuperação), sem fine-tuning do modelo.
"""
import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent / "nexus.db"


def _conn():
    c = sqlite3.connect(str(DB_PATH))
    c.row_factory = sqlite3.Row
    return c


def ensure_schema():
    c = _conn()
    try:
        c.execute(
            "CREATE TABLE IF NOT EXISTS agent_memory ("
            " id INTEGER PRIMARY KEY AUTOINCREMENT,"
            " agent_key VARCHAR NOT NULL,"
            " kind VARCHAR DEFAULT 'learning',"
            " content TEXT NOT NULL,"
            " created_at VARCHAR NOT NULL)"
        )
        c.execute("CREATE INDEX IF NOT EXISTS idx_agent_memory_key ON agent_memory(agent_key)")
        c.commit()
    finally:
        c.close()


def add_learning(agent_key, content, kind="learning"):
    """Grava um aprendizado real do agente (resumo curto)."""
    if not content:
        return
    ensure_schema()
    c = _conn()
    try:
        c.execute(
            "INSERT INTO agent_memory (agent_key, kind, content, created_at) VALUES (?,?,?,?)",
            (str(agent_key).upper(), kind, str(content)[:800], datetime.utcnow().isoformat()),
        )
        c.commit()
    finally:
        c.close()


def recent_learnings(agent_key, limit=5):
    ensure_schema()
    c = _conn()
    try:
        rows = c.execute(
            "SELECT content, created_at FROM agent_memory WHERE agent_key=? "
            "ORDER BY id DESC LIMIT ?", (str(agent_key).upper(), int(limit)),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        c.close()


def memory_block(agent_key, limit=5):
    """Bloco de texto com os aprendizados recentes para injetar no prompt."""
    rows = recent_learnings(agent_key, limit)
    if not rows:
        return ""
    return "\n".join(f"- {r['content']}" for r in rows)


def count(agent_key=None):
    ensure_schema()
    c = _conn()
    try:
        if agent_key:
            r = c.execute("SELECT COUNT(*) n FROM agent_memory WHERE agent_key=?",
                          (str(agent_key).upper(),)).fetchone()
        else:
            r = c.execute("SELECT COUNT(*) n FROM agent_memory").fetchone()
        return r["n"]
    finally:
        c.close()
