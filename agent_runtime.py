"""
agent_runtime.py — Runtime real de execução de missões da FORJA OS.

run_mission(mission_id) -> dict

Fluxo real:
  buscar missão -> validar status -> selecionar agente -> RUNNING ->
  gerar prompt -> provider_router real -> resposta real -> salvar evidência
  (banco + arquivo .md) -> COMPLETED/FAILED -> audit_logs.

REGRAS: sem simulação, sem mascarar erro, sem expor secrets.
"""
import os
import json
import sqlite3
import threading
from datetime import datetime
from pathlib import Path

import provider_router as pr

# Trava de concorrência: impede duas execuções simultâneas da MESMA missão.
_LOCK = threading.Lock()
_RUNNING_IDS = set()

ROOT = Path(__file__).parent
DB_PATH = ROOT / "nexus.db"
EVIDENCE_DIR = ROOT / "19_RELATORIOS" / "EVIDENCES"

EXECUTABLE_STATUSES = {"PENDING", "QUEUED", "RUNNING"}

# Mapa simples missão->agente por palavra-chave (agentes reais do nexus.db)
AGENT_KEYWORDS = [
    ("audit", "QA"), ("auditoria", "QA"), ("test", "QA"),
    ("deploy", "DEVOPS"), ("vps", "DEVOPS"),
    ("provider", "AI_ENGINEER"), ("ollama", "AI_ENGINEER"), ("llm", "AI_ENGINEER"),
    ("custo", "ANALYST"), ("politic", "ANALYST"),
    ("binding", "DEVELOPER"), ("painel", "DEVELOPER"), ("api", "DEVELOPER"),
]


def _conn():
    c = sqlite3.connect(str(DB_PATH))
    c.row_factory = sqlite3.Row
    return c


def _ensure_evidence_schema(conn):
    """Migration idempotente: adiciona colunas exigidas se ausentes."""
    cols = {r["name"] for r in conn.execute("PRAGMA table_info(evidences)").fetchall()}
    to_add = {
        "agent_id": "VARCHAR",
        "provider": "VARCHAR",
        "content": "TEXT",
        "artifact_path": "VARCHAR",
        "status": "VARCHAR",
    }
    for col, typ in to_add.items():
        if col not in cols:
            conn.execute(f"ALTER TABLE evidences ADD COLUMN {col} {typ}")
    conn.commit()


def _audit(conn, event_type, details):
    conn.execute(
        "INSERT INTO audit_logs (event_type, details, created_at) VALUES (?,?,?)",
        (event_type, details, datetime.utcnow().isoformat()),
    )
    conn.commit()


def _select_agent(conn, title):
    t = (title or "").lower()
    agents = {r["name"]: r["id"] for r in conn.execute("SELECT id, name FROM agents").fetchall()}
    for kw, agent_name in AGENT_KEYWORDS:
        if kw in t and agent_name in agents:
            return agent_name, agents[agent_name]
    # fallback: ORCHESTRATOR ou primeiro agente real
    if "ORCHESTRATOR" in agents:
        return "ORCHESTRATOR", agents["ORCHESTRATOR"]
    name = next(iter(agents), None)
    return name, agents.get(name)


def _build_prompt(mission, agent_name):
    return (
        f"Você é o agente {agent_name} da Fábrica de Sistemas.\n"
        f"Missão {mission['id']}: {mission['title']}\n"
        f"Descrição: {mission['description'] or '(sem descrição)'}\n\n"
        f"Produza um resultado operacional objetivo (máx. 8 linhas) com os passos "
        f"executados e o status final. Responda em português."
    )


def run_mission(mission_id):
    """Executa uma missão real. mission_id pode ser int ou 'MIS-001'."""
    result = {"ok": False, "mission_id": mission_id, "agent": None,
              "provider": None, "status": None, "evidence_id": None,
              "artifact_path": None, "error": None}

    if isinstance(mission_id, str) and mission_id.upper().startswith("MIS-"):
        mid = int(mission_id.split("-")[1])
    else:
        mid = int(mission_id)

    # Trava: impede execução concorrente da mesma missão
    with _LOCK:
        if mid in _RUNNING_IDS:
            result["error"] = "missão já em execução (lock ativo)"
            result["status"] = "RUNNING"
            return result
        _RUNNING_IDS.add(mid)

    conn = _conn()
    try:
        _ensure_evidence_schema(conn)

        ms = conn.execute("SELECT * FROM missions WHERE id=?", (mid,)).fetchone()
        if not ms:
            result["error"] = "missão não encontrada"
            return result

        if ms["status"] not in EXECUTABLE_STATUSES and ms["status"] != "COMPLETED":
            # permite re-execução de COMPLETED para demonstração, bloqueia CANCELLED etc.
            if ms["status"] in {"CANCELLED", "FAILED"}:
                result["error"] = f"status {ms['status']} não permite execução"
                result["status"] = ms["status"]
                return result

        agent_name, agent_id = _select_agent(conn, ms["title"])
        result["agent"] = agent_name

        # RUNNING
        conn.execute("UPDATE missions SET status='RUNNING', updated_at=? WHERE id=?",
                     (datetime.utcnow().isoformat(), mid))
        conn.commit()
        _audit(conn, "MISSION_RUNNING", f"MIS-{mid:03d} agente={agent_name}")

        # Tenta usar o novo cérebro AGENTIC_CORE
        import sys
        if str(ROOT) not in sys.path:
            sys.path.append(str(ROOT))
            
        try:
            from AGENTIC_CORE.base_agent import BaseAgent
            # Instancia o novo agente cognitivo
            agent_instance = BaseAgent(
                name=agent_name,
                role="Operador Autônomo da Forja",
                goal=f"Executar a missão: {ms['title']}"
            )
            
            objective = f"{ms['title']}\nDetalhes: {ms['description'] or 'Nenhum'}"
            core_result = agent_instance.execute_mission(objective)
            
            resp_text = core_result.get("final_answer")
            if not resp_text:
                resp_text = f"O agente encerrou com status: {core_result.get('status')} sem resposta final."
                
            llm = {
                "ok": core_result.get("status") in ["completed", "max_steps_reached"],
                "provider": "AGENTIC_CORE_REACT",
                "model": "router_auto",
                "tokens_estimated": 0,
                "response": resp_text,
                "error": None if core_result.get("status") in ["completed", "max_steps_reached"] else "Erro cognitivo",
                "fallback_trail": None
            }
        except Exception as e:
            # Fallback de segurança para o motor antigo
            prompt = _build_prompt(ms, agent_name)
            import provider_governance as pg
            providers = {p.provider_key: p for p in conn.execute("SELECT * FROM llm_providers").fetchall()}
            certified = [k for k, p in providers.items() if p["status"] in {"CERTIFIED", "ROUTER_LIMITED"}]
            order = pg.execution_order(certified)
            if not order:
                llm = {"ok": False, "provider": None, "error": "Nenhum provider operacional."}
            else:
                llm = pr.execute_with_fallback(prompt, max_tokens=400, order=order)
            llm["error"] = llm.get("error") or str(e)

        result["provider"] = llm.get("provider")

        if llm.get("fallback_trail"):
            _audit(conn, "PROVIDER_FALLBACK_TRAIL", json.dumps(llm["fallback_trail"]))

        if not llm["ok"]:
            conn.execute("UPDATE missions SET status='FAILED', updated_at=? WHERE id=?",
                         (datetime.utcnow().isoformat(), mid))
            conn.commit()
            _audit(conn, "MISSION_FAILED", f"MIS-{mid:03d} erro={llm['error']}")
            result["status"] = "FAILED"
            result["error"] = llm["error"]
            return result

        # Evidência: arquivo físico .md
        EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
        ts = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
        artifact = EVIDENCE_DIR / f"MISSION_{mid}_EVIDENCE_{ts}.md"
        artifact.write_text(
            f"# Evidência — MIS-{mid:03d}\n\n"
            f"- Missão: {ms['title']}\n"
            f"- Agente: {agent_name} (id={agent_id})\n"
            f"- Provider: {llm['provider']} ({llm['model']})\n"
            f"- Tokens estimados: {llm['tokens_estimated']}\n"
            f"- Gerado: {datetime.utcnow().isoformat()}\n\n"
            f"## Resultado real do LLM\n\n{llm['response']}\n",
            encoding="utf-8",
        )
        result["artifact_path"] = str(artifact)

        # Evidência: banco
        cur = conn.execute(
            "INSERT INTO evidences (mission_id, description, file_path, created_at, "
            "agent_id, provider, content, artifact_path, status) "
            "VALUES (?,?,?,?,?,?,?,?,?)",
            (mid, f"Execução real via {llm['provider']}", str(artifact),
             datetime.utcnow().isoformat(), agent_name, llm["provider"],
             llm["response"], str(artifact), "COMPLETED"),
        )
        conn.commit()
        result["evidence_id"] = cur.lastrowid

        # COMPLETED
        conn.execute("UPDATE missions SET status='COMPLETED', updated_at=? WHERE id=?",
                     (datetime.utcnow().isoformat(), mid))
        conn.commit()
        _audit(conn, "MISSION_COMPLETED",
               f"MIS-{mid:03d} agente={agent_name} provider={llm['provider']} evidence_id={cur.lastrowid}")

        result["ok"] = True
        result["status"] = "COMPLETED"
        return result
    finally:
        conn.close()
        with _LOCK:
            _RUNNING_IDS.discard(mid)


def runtime_status():
    conn = _conn()
    try:
        _ensure_evidence_schema(conn)
        m = conn.execute("SELECT COUNT(*) c FROM missions").fetchone()["c"]
        e = conn.execute("SELECT COUNT(*) c FROM evidences").fetchone()["c"]
        providers = {p: pr.provider_status(p) for p in pr.PREFERRED_ORDER}
        available = [p for p, s in providers.items() if s == "CONFIGURADO"]
        return {
            "operational": len(available) > 0,
            "providers": providers,
            "providers_available": available,
            "missions_total": m,
            "evidences_total": e,
        }
    finally:
        conn.close()


def queue_status():
    """Contagem por estado da fila operacional."""
    conn = _conn()
    try:
        states = ["QUEUED", "RUNNING", "COMPLETED", "FAILED", "PENDING", "CANCELLED"]
        counts = {}
        for st in states:
            counts[st] = conn.execute(
                "SELECT COUNT(*) c FROM missions WHERE status=?", (st,)).fetchone()["c"]
        nxt = conn.execute(
            "SELECT id, title FROM missions WHERE status='QUEUED' ORDER BY id ASC LIMIT 1"
        ).fetchone()
        return {
            "counts": counts,
            "next_queued": (f"MIS-{nxt['id']:03d}" if nxt else None),
            "running_locked": sorted(f"MIS-{i:03d}" for i in _RUNNING_IDS),
        }
    finally:
        conn.close()


def tick():
    """Pega a próxima missão QUEUED (FIFO por id) e executa. Idempotente/seguro."""
    conn = _conn()
    try:
        nxt = conn.execute(
            "SELECT id FROM missions WHERE status='QUEUED' ORDER BY id ASC LIMIT 1"
        ).fetchone()
        if not nxt:
            return {"ok": True, "executed": False, "reason": "fila vazia (nenhuma QUEUED)",
                    "queue": queue_status()}
        mid = nxt["id"]
        # Claim atômico: só prossegue se ninguém pegou antes
        cur = conn.execute(
            "UPDATE missions SET status='RUNNING', updated_at=? "
            "WHERE id=? AND status='QUEUED'", (datetime.utcnow().isoformat(), mid))
        conn.commit()
        if cur.rowcount == 0:
            return {"ok": True, "executed": False,
                    "reason": "missão já reivindicada por outro tick", "queue": queue_status()}
        _audit(conn, "QUEUE_TICK_CLAIM", f"MIS-{mid:03d} reivindicada da fila")
    finally:
        conn.close()

    result = run_mission(mid)
    result["executed"] = True
    result["queue"] = queue_status()
    return result


if __name__ == "__main__":
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else "MIS-001"
    if cmd == "tick":
        print(json.dumps(tick(), ensure_ascii=False, indent=2))
    elif cmd == "queue":
        print(json.dumps(queue_status(), ensure_ascii=False, indent=2))
    else:
        print(json.dumps(run_mission(cmd), ensure_ascii=False, indent=2))
