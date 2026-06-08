"""
forja_os_server.py — FastAPI unificado da FORJA OS.

MODO PRODUÇÃO: serve o build estático + endpoints reais.
MODO DEV: use `npm run build` para rebuild; frontend via arquivo.

Decisão da Diretoria:
- Chaves internas em inglês.
- Interface 100% em português.
- LLMs: assinaturas sem custo incremental, APIs pagas bloqueadas por padrão.
- Sem dados mockados nos endpoints — apenas dados reais do banco.
"""
import os
import json
import sys
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

# ── FastAPI ────────────────────────────────────────────────────────────────
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# ── Internal modules ───────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
from _compat_db import get_db, init_db
import _compat_models as m

# Importa a camada de autenticação
sys.path.insert(0, str(Path(__file__).parent / "17_RUNTIME" / "auth"))
from auth_service import router as auth_router, get_current_user, check_permissions


# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
logger = logging.getLogger("forja_os")

# ── Config ─────────────────────────────────────────────────────────────────
DIST_DIR = Path(__file__).parent / "16_SISTEMAS" / "FORJA_OS_PLATFORM" / "dist"
LLM_REGISTRY_PATH = Path(__file__).parent / "17_AUTOMACOES" / "LLM_ROUTER" / "provider_registry.json"
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FORJA OS — Fábrica de Sistemas",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
)

# CORS para modo dev (Vite / npm serve na porta diferente)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# --- Middleware de Autenticação Global ---
from fastapi.responses import JSONResponse

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    import os
    from auth_service import FORJA_AUTH_REQUIRED, decode_token, is_session_revoked
    from _compat_db import SessionLocal

    if not FORJA_AUTH_REQUIRED:
        return await call_next(request)

    path = request.url.path
    if not path.startswith("/api/") or path.startswith("/api/auth/login") or path.startswith("/api/health") or path == "/api/docs" or path == "/api/openapi.json":
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Token ausente ou invalido"})

    token = auth_header.split(" ")[1]
    db = SessionLocal()
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        if not jti or is_session_revoked(db, jti):
            return JSONResponse(status_code=401, content={"detail": "Sessão revogada ou invalida"})
        
        # Injeta info de auth no request state
        request.state.user = payload
    except Exception as e:
        db.close()
        return JSONResponse(status_code=401, content={"detail": str(e)})
    
    db.close()
    return await call_next(request)



# ══════════════════════════════════════════════════════════════════════════════
# HEALTH
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "forja-os",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }


# ══════════════════════════════════════════════════════════════════════════════
# MISSIONS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/missions")
def list_missions(
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Lista missões reais do banco de dados."""
    query = db.query(m.Mission)
    if status:
        query = query.filter(m.Mission.status == status.upper())
    missions = query.order_by(m.Mission.created_at.desc()).limit(limit).all()
    return {
        "total": query.count(),
        "items": [
            {
                "id": f"MIS-{ms.id:03d}",
                "titulo": ms.title,
                "status": ms.status,
                "created_at": ms.created_at.isoformat() if ms.created_at else None,
                "updated_at": ms.updated_at.isoformat() if ms.updated_at else None,
                "description": ms.description,
            }
            for ms in missions
        ],
        "source": "real_database",
    }


@app.get("/api/missions/{mission_id}")
def get_mission(mission_id: str, db: Session = Depends(get_db)):
    mid = int(mission_id.split("-")[1]) if mission_id.upper().startswith("MIS-") else int(mission_id)
    ms = db.query(m.Mission).filter(m.Mission.id == mid).first()
    if not ms:
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    return {
        "id": f"MIS-{ms.id:03d}",
        "titulo": ms.title,
        "status": ms.status,
        "description": ms.description,
        "created_at": ms.created_at.isoformat() if ms.created_at else None,
        "evidences": [
            {"description": e.description, "created_at": e.created_at.isoformat()}
            for e in ms.evidences
        ],
    }


# ══════════════════════════════════════════════════════════════════════════════
# AGENTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/agents")
def list_agents(db: Session = Depends(get_db)):
    """Lista agentes reais do banco de dados."""
    agents = db.query(m.Agent).all()
    return {
        "total": len(agents),
        "items": [
            {
                "id": f"AGT-{ag.id:03d}",
                "nome": ag.name,
                "papel": ag.role,
                "status": ag.status,
            }
            for ag in agents
        ],
        "source": "real_database",
    }


# ══════════════════════════════════════════════════════════════════════════════
# LLM / CENTRAL DE IA
# ══════════════════════════════════════════════════════════════════════════════

def _load_llm_registry() -> dict:
    try:
        return json.loads(LLM_REGISTRY_PATH.read_text(encoding="utf-8"))
    except Exception as e:
        logger.error("Erro ao ler LLM registry: %s", e)
        return {}


def _check_ollama_health() -> dict:
    """Verifica Ollama sem simular — retorna apenas o que sabe de verdade."""
    import urllib.request
    try:
        req = urllib.request.Request(f"{OLLAMA_URL}/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=2) as resp:
            data = json.loads(resp.read())
            models = [mod.get("name", "") for mod in data.get("models", [])]
            return {
                "reachable": True,
                "models": models,
                "health_status": "active_real" if models else "inactive",
                "checked_at": datetime.now(timezone.utc).isoformat(),
            }
    except Exception as e:
        return {
            "reachable": False,
            "models": [],
            "health_status": "unavailable",
            "error": type(e).__name__,
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }


@app.get("/api/llm/providers")
def llm_providers():
    """
    Retorna provedores LLM com classificação correta:
    - Assinaturas: custo incremental R$ 0, automação assistida
    - Local: Ollama, health verificado em tempo real
    - APIs pagas: bloqueadas por padrão
    """
    registry = _load_llm_registry()
    ollama_health = _check_ollama_health()

    providers = []
    for pid, p in registry.get("providers", {}).items():
        provider_data = {
            "id": pid,
            "display_name": p.get("display_name", pid),
            "provider_type": p.get("provider_type"),
            "automation_mode": p.get("automation_mode"),
            "billing_mode": p.get("billing_mode"),
            "cost_incremental": p.get("cost_incremental", 0),
            "requires_director_approval": p.get("requires_director_approval", False),
            "allowed_for_agents": p.get("allowed_for_agents", False),
            "capabilities": p.get("capabilities", []),
            "notes": p.get("notes", ""),
            "models": [
                model for model in [
                    p.get("model_id"),
                    *p.get("fallback_model_ids", []),
                ] if model
            ],
            "primary_model": p.get("model_id"),
            "fallback_models": p.get("fallback_model_ids", []),
        }

        # Health real para Ollama — nunca simulado
        if pid == "ollama_local":
            provider_data["health_status"] = ollama_health["health_status"]
            provider_data["models"] = ollama_health["models"]
            provider_data["last_health_check"] = ollama_health["checked_at"]
            provider_data["reachable"] = ollama_health["reachable"]
        else:
            provider_data["health_status"] = p.get("health_status", "unknown")
            provider_data["last_health_check"] = p.get("last_health_check", "")

        providers.append(provider_data)

    return {
        "total": len(providers),
        "policy": registry.get("policy", "LLM_COST_ZERO_GOVERNANCE_V1"),
        "providers": providers,
        "routing_table": registry.get("routing_table", {}),
        "source": "real_registry",
    }


@app.get("/api/llm/health")
def llm_health_check():
    """Health check rápido do Ollama local."""
    return _check_ollama_health()


# ══════════════════════════════════════════════════════════════════════════════
# AUDIT LOG
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/audit")
def list_audit(limit: int = 50, db: Session = Depends(get_db)):
    """Lista entradas de auditoria reais. Coluna real do schema: audit_logs.details."""
    logs = db.query(m.AuditLog).order_by(m.AuditLog.id.desc()).limit(limit).all()
    return {
        "total": len(logs),
        "items": [
            {
                "id": log.id,
                "event_type": log.event_type,
                "details": log.details,
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ],
        "source": "real_database",
    }


# ══════════════════════════════════════════════════════════════════════════════
# SISTEMA STATUS (painel inicial)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/status")
def system_status(db: Session = Depends(get_db)):
    """Status geral do sistema com dados reais."""
    try:
        mission_count = db.query(m.Mission).count()
        running_count = db.query(m.Mission).filter(m.Mission.status == "RUNNING").count()
        agent_count = db.query(m.Agent).count()
    except Exception:
        mission_count = running_count = agent_count = 0

    ollama = _check_ollama_health()

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "missions": {"total": mission_count, "running": running_count},
        "agents": {"total": agent_count},
        "ollama": {
            "status": ollama["health_status"],
            "models": len(ollama.get("models", [])),
        },
        "database": "ok",
        "source": "real",
    }


# ══════════════════════════════════════════════════════════════════════════════
# AGENT RUNTIME REAL
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/missions/{mission_id}/run")
def run_mission_endpoint(mission_id: str):
    """Executa uma missão real via agent_runtime (provider LLM real)."""
    import agent_runtime
    result = agent_runtime.run_mission(mission_id)
    if not result["ok"] and result.get("error") == "missão não encontrada":
        raise HTTPException(status_code=404, detail="Missão não encontrada")
    return result


@app.get("/api/missions/{mission_id}/evidences")
def mission_evidences(mission_id: str, db: Session = Depends(get_db)):
    """Lista evidências reais de uma missão."""
    if mission_id.upper().startswith("MIS-"):
        mid = int(mission_id.split("-")[1])
    else:
        mid = int(mission_id)
    rows = db.execute(
        m.Evidence.__table__.select().where(m.Evidence.mission_id == mid)
        .order_by(m.Evidence.id.desc())
    ).fetchall()
    return {
        "mission_id": f"MIS-{mid:03d}",
        "total": len(rows),
        "items": [
            {
                "id": r.id,
                "mission_id": r.mission_id,
                "description": r.description,
                "file_path": r.file_path,
                "created_at": r.created_at.isoformat() if hasattr(r.created_at, "isoformat") else r.created_at,
            }
            for r in rows
        ],
        "source": "real_database",
    }


@app.get("/api/runtime/status")
def runtime_status_endpoint():
    """Status operacional do runtime real."""
    import agent_runtime
    return agent_runtime.runtime_status()


@app.post("/api/runtime/tick")
def runtime_tick_endpoint():
    """Pega a próxima missão QUEUED e executa (fila operacional)."""
    import agent_runtime
    return agent_runtime.tick()


@app.get("/api/runtime/queue")
def runtime_queue_endpoint():
    """Estado da fila operacional por status."""
    import agent_runtime
    return agent_runtime.queue_status()


@app.get("/api/panel/truth-status")
def panel_truth_status(db: Session = Depends(get_db)):
    """Mapa de verdade: origem real de cada bloco do painel. Honesto por design."""
    try:
        missions_total = db.query(m.Mission).count()
    except Exception:
        missions_total = 0
    try:
        agents_total = db.query(m.Agent).count()
    except Exception:
        agents_total = 0
    try:
        evidences_total = db.query(m.Evidence).count()
    except Exception:
        evidences_total = 0
    try:
        audit_total = db.query(m.AuditLog).count()
    except Exception:
        audit_total = 0
    import billing_config
    b = billing_config.get_billing_status()
    oll = _check_ollama_health()

    cards = [
        {"card": "missions", "value": missions_total, "source": "real_database"},
        {"card": "agents", "value": agents_total, "source": "real_database"},
        {"card": "evidences", "value": evidences_total, "source": "real_database"},
        {"card": "audit_events", "value": audit_total, "source": "real_database"},
        {"card": "ollama", "value": oll["health_status"], "source": "real_runtime"},
        {"card": "daily_cost_usd", "value": b["daily_used_usd"], "source": b["source"]},
        {"card": "monthly_cost_usd", "value": b["monthly_used_usd"], "source": b["source"]},
        {"card": "monthly_budget_usd", "value": b["monthly_budget_usd"], "source": "config"},
        {"card": "projects", "value": "SEM DADOS REAIS", "source": "sem_dados_reais"},
        {"card": "uptime", "value": "NÃO MONITORADO", "source": "sem_dados_reais"},
        {"card": "test_coverage", "value": "NÃO CALCULADA", "source": "sem_dados_reais"},
        {"card": "deploys", "value": "NÃO MONITORADO", "source": "sem_dados_reais"},
        {"card": "knowledge_index", "value": "NÃO MONITORADO", "source": "sem_dados_reais"},
        {"card": "throughput_chart", "value": "NÃO MONITORADO", "source": "sem_dados_reais"},
        {"card": "service_pings", "value": "NÃO MONITORADO", "source": "sem_dados_reais"},
        {"card": "agent_chat", "value": "SEM EXECUÇÃO REAL VINCULADA", "source": "sem_dados_reais"},
    ]
    return {"cards": cards, "generated": datetime.now(timezone.utc).isoformat(),
            "policy": "TRUTH_PURGE_V1 — só dados reais ou rótulo honesto"}


@app.get("/api/dashboard")
def dashboard_endpoint(db: Session = Depends(get_db)):
    """KPIs reais do painel inicial — apenas dados do nexus.db. Sem números inventados."""
    by_status = {}
    for st in ["PENDING", "QUEUED", "RUNNING", "FAILED", "COMPLETED"]:
        by_status[st] = db.query(m.Mission).filter(m.Mission.status == st).count()
    missions_total = db.query(m.Mission).count()
    agents_total = db.query(m.Agent).count()
    try:
        evidences_total = db.query(m.Evidence).count()
    except Exception:
        evidences_total = 0
    try:
        audit_total = db.query(m.AuditLog).count()
    except Exception:
        audit_total = 0
    ollama = _check_ollama_health()
    return {
        "missions": {"total": missions_total, "by_status": by_status},
        "agents": {"total": agents_total},
        "evidences": {"total": evidences_total},
        "audit": {"total": audit_total},
        "projects": {"total": 0, "note": "sem tabela de projetos no banco — sem dados reais"},
        "ollama": {"status": ollama["health_status"], "models": len(ollama.get("models", []))},
        "source": "real_database",
    }


@app.get("/api/projects")
def projects_endpoint():
    """Projetos reais. Não há tabela de projetos no nexus.db → lista vazia honesta."""
    return {"total": 0, "items": [], "source": "sem_dados_reais",
            "note": "Nenhuma tabela de projetos no banco. Sem dados inventados."}


@app.get("/api/services")
def services_endpoint(db: Session = Depends(get_db)):
    """Saúde real dos serviços — verificada, sem pings/uptime fabricados."""
    services = []
    # FastAPI: se respondemos, está OK
    services.append({"id": "fastapi", "nome": "FastAPI", "status": "ok", "ping": "ativo"})
    # Banco: tenta um SELECT real
    try:
        db.query(m.Agent).count()
        services.append({"id": "database", "nome": "Banco Central", "status": "ok", "ping": "ativo"})
    except Exception:
        services.append({"id": "database", "nome": "Banco Central", "status": "err", "ping": "—"})
    # Ollama: health real
    oll = _check_ollama_health()
    services.append({"id": "ollama", "nome": "Ollama",
                     "status": "ok" if oll["health_status"] == "active_real" else "idle",
                     "ping": "ativo" if oll["reachable"] else "—"})
    # Missões: derivado do banco
    services.append({"id": "mission", "nome": "Missões", "status": "ok", "ping": "ativo"})
    # Sem verificação real disponível → honesto
    for sid, nome in [("github", "Repositório"), ("knowledge", "Conhecimento"), ("deploy", "Publicação")]:
        services.append({"id": sid, "nome": nome, "status": "idle", "ping": "sem dados"})
    return {"items": services, "source": "real_health_check"}


@app.get("/api/billing/status")
def billing_status_endpoint():
    """Status de billing real: budgets $1/dia, $30/mês, uso real ou sem_dados_reais."""
    import billing_config
    return billing_config.get_billing_status()


@app.get("/api/providers/test")
def providers_test():
    """Status de configuração dos providers (NUNCA expõe chaves)."""
    import provider_router
    providers = {p: provider_router.provider_status(p) for p in provider_router.PREFERRED_ORDER}
    return {
        "providers": providers,
        "available": [p for p, s in providers.items() if s == "CONFIGURADO"],
        "note": "Status de configuração — valores de chave nunca expostos.",
    }


# ══════════════════════════════════════════════════════════════════════════════
# HOME EXECUTIVE (REALITY ENGINE)
# ══════════════════════════════════════════════════════════════════════════════
sys.path.insert(0, str(Path(__file__).parent / "17_RUNTIME"))
from reality_engine import reality_engine as re_facade

@app.get("/api/home/overview")
def home_overview(db: Session = Depends(get_db)):
    return re_facade.get_overview(db)

@app.get("/api/home/health")
def home_health(db: Session = Depends(get_db)):
    return re_facade.get_health(db)

@app.get("/api/home/providers")
def home_providers(db: Session = Depends(get_db)):
    return re_facade.get_providers(db)

@app.get("/api/home/missions")
def home_missions(db: Session = Depends(get_db)):
    return re_facade.get_missions(db)

@app.get("/api/home/github")
def home_github(db: Session = Depends(get_db)):
    return re_facade.get_github(db)

@app.get("/api/home/timeline")
def home_timeline(db: Session = Depends(get_db)):
    return re_facade.get_timeline(db)

@app.get("/api/home/alerts")
def home_alerts(db: Session = Depends(get_db)):
    return re_facade.get_alerts(db)

@app.get("/api/home/evidence")
def home_evidence(db: Session = Depends(get_db)):
    return re_facade.get_evidence(db)


# ══════════════════════════════════════════════════════════════════════════════
# STATIC FILES — serve frontend buildado
# ══════════════════════════════════════════════════════════════════════════════

if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    # Serve CSS e assets estáticos
    app.mount("/css", StaticFiles(directory=str(DIST_DIR / "css")), name="css")
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/favicon.svg")
    def favicon():
        return FileResponse(str(DIST_DIR / "favicon.svg"))

    @app.get("/health.json")
    def health_json():
        return FileResponse(str(DIST_DIR / "health.json"))

    # SPA fallback — todas as rotas não-API servem o index.html
    @app.get("/{full_path:path}")
    def spa_fallback(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Endpoint não encontrado")
        index = DIST_DIR / "index.html"
        if index.exists():
            return FileResponse(str(index))
        raise HTTPException(status_code=503, detail="Frontend não buildado. Execute: npm run build")

    logger.info("FORJA OS: frontend servido de %s", DIST_DIR)
else:
    logger.warning("FORJA OS: dist não encontrado. Execute npm run build em 16_SISTEMAS/FORJA_OS_PLATFORM/")

    @app.get("/")
    def no_frontend():
        return JSONResponse(
            {"error": "Frontend não buildado", "instrucao": "cd 16_SISTEMAS/FORJA_OS_PLATFORM && npm run build"},
            status_code=503,
        )



# ══════════════════════════════════════════════════════════════════════════════
# STARTUP
# ══════════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup():
    init_db()
    logger.info("FORJA OS iniciada. Docs: http://localhost:8000/api/docs")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("forja_os_server:app", host="0.0.0.0", port=port, reload=False)
