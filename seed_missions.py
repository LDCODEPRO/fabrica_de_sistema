"""
seed_missions.py — Seed idempotente de missões operacionais iniciais no nexus.db.

REGRAS:
- Não duplica banco. Usa o nexus.db oficial.
- Idempotente: identifica seeds por prefixo de título e não reinsere.
- Dados claramente marcados como seed operacional inicial (não fake apresentado como real).
- Usa apenas colunas do schema real: title, description, status, created_at, updated_at.
"""
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

DB_PATH = Path(__file__).parent / "nexus.db"
SEED_TAG = "[SEED]"  # marcador honesto: dado inicial operacional

# Missões iniciais operacionais reais da Fábrica (status válidos do schema/UI)
SEED_MISSIONS = [
    {
        "title": f"{SEED_TAG} Validar binding do painel FORJA OS com /api/missions",
        "description": "Confirmar que o painel renderiza missões reais do nexus.db via api.js.",
        "status": "RUNNING",
    },
    {
        "title": f"{SEED_TAG} Certificar Ollama local como provider active_real",
        "description": "Executar health check real e registrar evidência de geração.",
        "status": "QUEUED",
    },
    {
        "title": f"{SEED_TAG} Auditar políticas de custo zero das assinaturas",
        "description": "Garantir R$ 0 incremental e APIs pagas bloqueadas por padrão.",
        "status": "PENDING",
    },
    {
        "title": f"{SEED_TAG} Preparar perfil de deploy local e VPS",
        "description": "Validar docker-compose local/vps e scripts de start/stop.",
        "status": "COMPLETED",
    },
    {
        "title": f"{SEED_TAG} Revisar trilha de auditoria imutável (Lei Zero Fantasma)",
        "description": "Conferir que toda ação gera evidência verificável em audit_logs.",
        "status": "QUEUED",
    },
]


def seed():
    conn = sqlite3.connect(str(DB_PATH))
    cur = conn.cursor()

    before = cur.execute("SELECT COUNT(*) FROM missions").fetchone()[0]
    inserted = 0
    now = datetime.utcnow()

    for i, ms in enumerate(SEED_MISSIONS):
        exists = cur.execute(
            "SELECT 1 FROM missions WHERE title = ? LIMIT 1", (ms["title"],)
        ).fetchone()
        if exists:
            continue
        ts = (now - timedelta(minutes=10 * i)).isoformat()
        cur.execute(
            "INSERT INTO missions (title, description, status, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (ms["title"], ms["description"], ms["status"], ts, ts),
        )
        inserted += 1

    conn.commit()
    after = cur.execute("SELECT COUNT(*) FROM missions").fetchone()[0]
    conn.close()

    print(f"missions ANTES: {before}")
    print(f"inseridas nesta execucao: {inserted}")
    print(f"missions DEPOIS: {after}")
    return before, inserted, after


if __name__ == "__main__":
    seed()
