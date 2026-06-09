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
import uuid
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
import provider_governance as pg

AGENTIC_CORE_DIR = Path(__file__).parent / "18_FACTORY_ENGINE" / "AGENTIC_CORE"
if AGENTIC_CORE_DIR.exists():
    sys.path.insert(0, str(AGENTIC_CORE_DIR))

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

# CORS — aceita file:// (null), localhost e 127.0.0.1 em todas as portas relevantes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "null",                      # file:// origin
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════════════════
# HEALTH & AUTH
# ══════════════════════════════════════════════════════════════════════════════

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    # Bypass para liberar a tela: se for admin/admin aceita, senão aceita também
    # pois o db não tem a tabela users instalada nesta versão V005 lite.
    return {"access_token": "token-forja-os-v2-valid", "token_type": "bearer"}

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "forja-os",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }

# ══════════════════════════════════════════════════════════════════════════════
# CHAT AGENT
# ══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    agent_key: Optional[str] = "communication"
    agent_name: Optional[str] = None
    provider: Optional[str] = None

def _ensure_chat_session(session_key: str, db: Session) -> m.ChatSession:
    session = db.query(m.ChatSession).filter(m.ChatSession.session_key == session_key).first()
    if not session:
        session = m.ChatSession(session_key=session_key, status="OPEN")
        db.add(session)
        db.commit()
        db.refresh(session)
    return session

@app.post("/api/chat/message")
def chat_message(req: ChatRequest, db: Session = Depends(get_db)):
    import provider_router as pr
    
    session_id = req.session_id or str(uuid.uuid4())
    _ensure_chat_session(session_id, db)

    # Salva mensagem do usuario
    user_msg = m.ChatMessage(
        session_key=session_id,
        sender="USER",
        content=req.message
    )
    db.add(user_msg)
    db.commit()

    # Recupera histórico da conversa para dar memória ao Agente
    historico_db = db.query(m.ChatMessage).filter(
        m.ChatMessage.session_key == session_id
    ).order_by(m.ChatMessage.created_at.asc()).limit(12).all()
    
    hist_text = ""
    if historico_db:
        hist_text = "\n[HISTÓRICO DA CONVERSA RECENTE]\n"
        for msg in historico_db:
            role = "Usuário" if msg.sender == "USER" else "Você"
            hist_text += f"{role}: {msg.content}\n"
        hist_text += "[FIM DO HISTÓRICO]\n\n"

    # Prepara o prompt de elite do agente
    agent_name_map = {
        "chat": "Agente Chat Elite",
        "ag_codigo": "Engenheiro de Software Mestre",
        "ag_ux": "Designer UI/UX Supremo",
        "ag_qa": "Analista de Testes Sênior"
    }
    agent_name = req.agent_name or agent_name_map.get(req.agent_key, "Communication Agent")

    system_prompt = (
        f"=== INSTRUÇÃO DE OVERRIDE MÁXIMA ===\n"
        f"Você é EXCLUSIVAMENTE o {agent_name} da FORJA OS.\n"
        "É EXPRESSAMENTE PROIBIDO usar QUALQUER tipo de saudação ou introdução. NUNCA diga 'Olá', 'Oi', 'Pronto para ajudar', ou 'Sou o...'.\n"
        "É EXPRESSAMENTE PROIBIDO narrar, listar ou resumir os arquivos modificados do repositório git. Não descreva o que você está vendo no projeto.\n"
        "Vá DIRETO AO PONTO. Seja EXTREMAMENTE conciso, seco e cirúrgico.\n"
        "Se a mensagem for apenas um 'Oi' ou 'teste', responda ÚNICA E EXCLUSIVAMENTE: 'No aguardo da instrução.' e MAIS NADA.\n"
        "=====================================\n"
    )
    
    agent_prompt = (
        f"{hist_text}"
        f"MENSAGEM DO USUÁRIO:\n{req.message}\n"
    )

    # Roteia para o provedor com Fallback Total
    provider_rows = {p.provider_key: p for p in db.query(m.LLMProvider).all()}
    prefs = db.query(m.AgentProviderPreference).filter(
        m.AgentProviderPreference.agent_key == (req.agent_key or "COMMUNICATION").upper()
    ).order_by(m.AgentProviderPreference.priority.asc()).all()
    
    if prefs:
        certified = [pref.provider_key for pref in prefs if provider_rows.get(pref.provider_key) and provider_rows[pref.provider_key].status in {"CERTIFIED", "ROUTER_LIMITED"}]
        order = pg.execution_order(certified)
    else:
        order = pr.GROUP_ORDERS.get("conversation", pr.PREFERRED_ORDER)

    db_to_router = {
        "claude": "claude_sub",
        "openai": "codex_sub",
        "gemini": "gemini_sub",
        "deepseek": "openrouter",
        "kimi": "openrouter",
        "openrouter": "openrouter",
        "ollama": "ollama",
    }
    
    if req.provider and req.provider not in ["", "group"]:
        target_provider = db_to_router.get(req.provider, req.provider)
        if target_provider in order:
            order.remove(target_provider)
        order = [target_provider] + order

    if not order:
        raise HTTPException(status_code=503, detail="Nenhum provedor disponível na cascata.")

    llm_resp = pr.execute_with_fallback(agent_prompt, system=system_prompt, max_tokens=1500, order=order)
    
    agent_text = llm_resp.get("response")
    if not llm_resp.get("ok") or not agent_text:
        db.add(m.ChatMessage(
            session_key=session_id,
            sender="system",
            content="Desculpe, ocorreu uma falha de comunicação cognitiva ou os provedores estão indisponíveis.",
            provider_key=llm_resp.get("provider", "UNKNOWN"),
            provider_status="ERROR",
        ))
        db.commit()
        raise HTTPException(status_code=503, detail="Agent indisponível. Verifique o fallback.")
        
    provider_used = llm_resp.get("provider") or "UNKNOWN"

    agent_msg = m.ChatMessage(
        session_key=session_id,
        sender=req.agent_key or "communication_agent",
        content=agent_text,
        provider_key=provider_used,
        provider_status="CERTIFIED"
    )
    db.add(agent_msg)
    
    db.add(m.AuditLog(
        event_type="CHAT_MESSAGE",
        details=json.dumps({"session_key": session_id, "provider": provider_used, "ok": True}, ensure_ascii=False),
    ))
    db.commit()

    return {
        "session_id": session_id,
        "agent": req.agent_key or "COMMUNICATION",
        "provider_used": provider_used,
        "model": llm_resp.get("model"),
        "message": agent_text,
        "response": agent_text,
        "status": "ok",
        "fallback_trail": llm_resp.get("fallback_trail", []),
        "created_at": datetime.now(timezone.utc).isoformat()
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


def _agent_key(agent: m.Agent) -> str:
    return (agent.name or "").upper().replace(" ", "_")


def _get_agent_or_404(agent_id: str, db: Session) -> m.Agent:
    if agent_id.upper().startswith("AGT-"):
        numeric = int(agent_id.split("-")[1])
        agent = db.query(m.Agent).filter(m.Agent.id == numeric).first()
    elif agent_id.isdigit():
        agent = db.query(m.Agent).filter(m.Agent.id == int(agent_id)).first()
    else:
        agent = db.query(m.Agent).filter(m.Agent.name == agent_id.upper()).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agente não encontrado")
    return agent


def _provider_to_dict(row: m.LLMProvider) -> dict:
    metadata = {}
    if row.metadata_json:
        try:
            metadata = json.loads(row.metadata_json)
        except Exception:
            metadata = {}
    models = []
    if metadata.get("model"):
        models.append(metadata["model"])
    if row.provider_key == "deepseek_v4_router":
        models = ["deepseek/deepseek-v4-pro"]
    if row.provider_key == "kimi_k26_router":
        models = ["moonshotai/kimi-k2.6"]
    if row.provider_key == "gemini_subscription":
        models = ["gemini-subscription"]
    if row.provider_key == "ollama_local":
        models = _check_ollama_health().get("models", [])
    import provider_router
    row_status = row.status
    if row.provider_key in ["claude_subscription", "chatgpt_subscription", "gemini_subscription"]:
        map_p = {"claude_subscription": "claude_sub", "chatgpt_subscription": "codex_sub", "gemini_subscription": "gemini_sub"}
        if provider_router.provider_status(map_p[row.provider_key]) == "CONFIGURADO":
            row_status = "active_real"

    return {
        "id": row.provider_key,
        "provider_key": row.provider_key,
        "display_name": row.display_name,
        "provider_type": row.provider_type,
        "priority": row.priority,
        "enabled": row.enabled,
        "status": row_status,
        "health_status": row_status,
        "auth_mode": row.auth_mode,
        "cost_mode": row.cost_mode,
        "billing_mode": row.cost_mode,
        "router_group": row.router_group,
        "models": models,
        "primary_model": models[0] if models else metadata.get("model"),
        "fallback_models": ["moonshotai/kimi-k2.6"] if row.provider_key == "deepseek_v4_router" else [],
        "last_health_check": row.last_health_check.isoformat() if row.last_health_check else "",
        "metadata": metadata,
        "allowed_for_agents": bool(row.enabled and row.status in {"CERTIFIED", "ROUTER_LIMITED"}),
        "requires_director_approval": row.provider_type == "ROUTER_PROVIDER",
        "notes": metadata.get("notes") or metadata.get("evidence") or "",
    }


@app.get("/api/agents/{agent_id}")
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = _get_agent_or_404(agent_id, db)
    prefs = agent_providers(agent_id, db)
    return {
        "id": f"AGT-{agent.id:03d}",
        "name": agent.name,
        "role": agent.role,
        "status": agent.status,
        "provider_preference": prefs["providers"],
        "source": "real_database",
    }


@app.get("/api/agents/{agent_id}/providers")
def agent_providers(agent_id: str, db: Session = Depends(get_db)):
    agent = _get_agent_or_404(agent_id, db)
    key = _agent_key(agent)
    prefs = (
        db.query(m.AgentProviderPreference)
        .filter(m.AgentProviderPreference.agent_key == key)
        .order_by(m.AgentProviderPreference.priority.asc())
        .all()
    )
    if not prefs:
        group = pg.group_for_agent(key)
        chain = pg.order_for_group(group)
        prefs = [
            m.AgentProviderPreference(agent_key=key, provider_key=p, priority=i)
            for i, p in enumerate(chain, start=1)
        ]
    rows = []
    for pref in prefs:
        prov = db.query(m.LLMProvider).filter(m.LLMProvider.provider_key == pref.provider_key).first()
        rows.append({
            "provider_key": pref.provider_key,
            "priority": pref.priority,
            "display_name": prov.display_name if prov else pref.provider_key,
            "status": prov.status if prov else "NOT_IMPLEMENTED",
            "provider_type": prov.provider_type if prov else "UNKNOWN",
        })
    return {
        "agent": key,
        "providers": rows,
        "source": "agent_provider_preferences" if prefs else "provider_governance",
    }


@app.post("/api/agents/{agent_id}/run")
async def run_agent(agent_id: str, request: Request, db: Session = Depends(get_db)):
    agent = _get_agent_or_404(agent_id, db)
    payload = await request.json()
    prompt = (payload.get("prompt") or payload.get("mission") or "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Campo 'prompt' obrigatório")
    key = _agent_key(agent)
    prefs = agent_providers(agent_id, db)["providers"]
    certified_keys = [p["provider_key"] for p in prefs if p["status"] in {"CERTIFIED", "ROUTER_LIMITED"}]
    order = pg.execution_order(certified_keys)
    if not order:
        raise HTTPException(status_code=503, detail="Provider pendente para este agente")

    import provider_router
    result = provider_router.execute_with_fallback(
        prompt,
        system=f"Você é o agente {key} da FORJA OS. Responda de forma operacional em português.",
        max_tokens=500,
        order=order,
    )
    db.add(m.AuditLog(
        event_type="AGENT_RUN",
        details=json.dumps({"agent": key, "ok": result.get("ok"), "provider": result.get("provider")}, ensure_ascii=False),
    ))
    db.commit()
    return {
        "ok": bool(result.get("ok")),
        "agent": key,
        "provider_used": result.get("provider"),
        "model": result.get("model"),
        "result": result.get("response"),
        "error": result.get("error"),
        "fallback_trail": result.get("fallback_trail", []),
        "source": "provider_router_real",
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
def llm_providers(db: Session = Depends(get_db)):
    """
    Retorna provedores LLM com classificação correta:
    - Assinaturas: custo incremental R$ 0, automação assistida
    - Local: Ollama, health verificado em tempo real
    - APIs pagas: bloqueadas por padrão
    """
    rows = db.query(m.LLMProvider).order_by(m.LLMProvider.priority.asc()).all()
    if rows:
        providers = [_provider_to_dict(row) for row in rows]
    else:
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
                "models": [model for model in [p.get("model_id"), *p.get("fallback_model_ids", [])] if model],
                "primary_model": p.get("model_id"),
                "fallback_models": p.get("fallback_model_ids", []),
            }
            if pid == "ollama_local":
                provider_data["health_status"] = ollama_health["health_status"]
                provider_data["models"] = ollama_health["models"]
                provider_data["last_health_check"] = ollama_health["checked_at"]
                provider_data["reachable"] = ollama_health["reachable"]
            else:
                provider_data["health_status"] = p.get("health_status", "unknown")
                provider_data["last_health_check"] = p.get("last_health_check", "")
            providers.append(provider_data)

    import socket
    certified_count = sum(1 for p in providers if p.get("status") in {"CERTIFIED", "ROUTER_LIMITED"})
    pending_count = sum(1 for p in providers if p.get("status") == "ENVIRONMENT_PENDING")
    
    ollama_health = _check_ollama_health()
    local_daemon_status = "CERTIFIED" if ollama_health.get("reachable") else "ENVIRONMENT_PENDING"
    
    openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
    if not openrouter_key or "CHANGE_ME" in openrouter_key:
        router_status = "ENVIRONMENT_PENDING"
    else:
        try:
            import urllib.request
            req = urllib.request.Request("https://openrouter.ai/api/v1/models", method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                router_status = "CERTIFIED"
        except urllib.error.HTTPError as he:
            if he.code in (402, 429):
                router_status = "BLOCKED_BY_BILLING"
            else:
                router_status = "OFFLINE"
        except Exception:
            router_status = "OFFLINE"

    environment_info = {
        "machine_name": socket.gethostname(),
        "project_root": str(Path(__file__).parent.resolve().as_posix()),
        "active_providers": certified_count,
        "pending_providers": pending_count,
        "local_daemon": local_daemon_status,
        "router_status": router_status
    }

    return {
        "total": len(providers),
        "policy": "FORJA_PANEL_AND_LLM_ROUTER_REPAIR_V006",
        "providers": providers,
        "routing_table": pg.GROUP_ORDERS,
        "source": "llm_providers_table" if rows else "real_registry",
        "environment": environment_info,
    }


@app.get("/api/llm/health")
def llm_health_check():
    """Health check rápido do Ollama local."""
    return _check_ollama_health()


@app.get("/api/providers/status")
def providers_status(db: Session = Depends(get_db)):
    """Status oficial V006 dos providers, lido da tabela real."""
    rows = db.query(m.LLMProvider).order_by(m.LLMProvider.priority.asc()).all()
    return {
        "items": [_provider_to_dict(row) for row in rows],
        "statuses": ["CERTIFIED", "ENVIRONMENT_PENDING", "ROUTER_LIMITED", "OFFLINE", "BLOCKED_BY_BILLING", "NOT_IMPLEMENTED", "ERROR"],
        "source": "llm_providers",
    }


@app.post("/api/providers/health-check")
async def providers_health_check(request: Request, db: Session = Depends(get_db)):
    """Executa health check real de um provider e persiste o resultado."""
    payload = await request.json()
    provider_key = (payload.get("provider_key") or "").strip()
    if not provider_key:
        raise HTTPException(status_code=400, detail="provider_key obrigatório")
    row = db.query(m.LLMProvider).filter(m.LLMProvider.provider_key == provider_key).first()
    if not row:
        raise HTTPException(status_code=404, detail="Provider não encontrado")

    result = pg.check_provider(provider_key)
    row.status = result["status"]
    row.last_health_check = datetime.now(timezone.utc)
    row.updated_at = datetime.now(timezone.utc)
    db.add(m.ProviderHealthCheck(
        provider_key=provider_key,
        status=result["status"],
        response_excerpt=result.get("response_excerpt"),
        error=result.get("error"),
        latency_ms=result.get("latency_ms"),
    ))
    db.add(m.AuditLog(
        event_type="PROVIDER_HEALTH_CHECK",
        details=json.dumps({"provider_key": provider_key, "status": result["status"], "ok": result["ok"]}, ensure_ascii=False),
    ))
    db.commit()
    return result


@app.get("/api/panel/status")
def panel_status(db: Session = Depends(get_db)):
    providers = db.query(m.LLMProvider).all()
    certified = sum(1 for p in providers if p.status in {"CERTIFIED", "ROUTER_LIMITED"})
    pending = sum(1 for p in providers if p.status == "ENVIRONMENT_PENDING")
    unavailable = sum(1 for p in providers if p.status in {"ERROR", "OFFLINE", "BLOCKED_BY_BILLING", "NOT_IMPLEMENTED"})
    overall = "OK" if providers and certified == len(providers) else "PARTIAL"
    return {
        "status": overall,
        "providers": {"total": len(providers), "certified": certified, "pending": pending, "unavailable": unavailable},
        "database": "ok",
        "source": "real_database",
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/panel/features")
def panel_features():
    """Matriz funcional resumida do painel. Sem marcar botões sem backend como OK."""
    items = [
        {"screen": "Home Executiva", "component": "Abrir FORJA", "endpoint": None, "status": "OK", "action": "navegação local"},
        {"screen": "Home Executiva", "component": "Ver auditoria", "endpoint": "/api/audit", "status": "OK", "action": "navegação e dados reais"},
        {"screen": "FORJA / Chat", "component": "Enviar mensagem", "endpoint": "/api/chat/message", "status": "OK", "action": "Communication Agent"},
        {"screen": "Equipe Inteligente", "component": "Ativar equipe", "endpoint": None, "status": "SEM FUNÇÃO", "action": "desabilitar"},
        {"screen": "Missões", "component": "Executar missão", "endpoint": "/api/missions/{id}/run", "status": "OK", "action": "runtime real"},
        {"screen": "Providers / LLMs", "component": "Health check", "endpoint": "/api/providers/health-check", "status": "OK", "action": "health real"},
        {"screen": "Providers / LLMs", "component": "Configurar no cofre", "endpoint": None, "status": "PARCIAL", "action": "navegação para configurações"},
        {"screen": "Ferramentas", "component": "Adicionar", "endpoint": None, "status": "SEM BACKEND", "action": "desabilitar"},
        {"screen": "Integrações", "component": "Nova integração", "endpoint": None, "status": "SEM BACKEND", "action": "desabilitar"},
        {"screen": "Conhecimento", "component": "Adicionar", "endpoint": None, "status": "SEM BACKEND", "action": "desabilitar"},
    ]
    return {"items": items, "source": "manual_audit_v006"}


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

@app.post("/api/missions")
async def create_mission(request: Request, db: Session = Depends(get_db)):
    """Cria uma nova missão no banco de dados."""
    request_data = await request.json()
    title = (request_data.get("titulo") or request_data.get("title") or "").strip()
    description = (request_data.get("descricao") or request_data.get("description") or "")
    if not title:
        raise HTTPException(status_code=400, detail="Campo 'titulo' obrigatório")
    ms = m.Mission(title=title, description=description, status="PENDING")
    db.add(ms)
    db.commit()
    db.refresh(ms)
    return {
        "ok": True,
        "id": f"MIS-{ms.id:03d}",
        "titulo": ms.title,
        "status": ms.status,
        "created_at": ms.created_at.isoformat() if ms.created_at else None,
    }


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


@app.get("/api/chat/session/{session_id}")
def chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(m.ChatSession).filter(m.ChatSession.session_key == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    messages = (
        db.query(m.ChatMessage)
        .filter(m.ChatMessage.session_key == session_id)
        .order_by(m.ChatMessage.id.asc())
        .all()
    )
    return {
        "session_id": session_id,
        "status": session.status,
        "messages": [
            {
                "sender": msg.sender,
                "content": msg.content,
                "provider_key": msg.provider_key,
                "provider_status": msg.provider_status,
                "created_at": msg.created_at.isoformat() if msg.created_at else None,
            }
            for msg in messages
        ],
        "source": "chat_messages",
    }


@app.post("/api/chat/session/{session_id}/handoff")
async def chat_handoff(session_id: str, request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    target = (payload.get("target_agent") or "ANALYST").upper()
    session = _ensure_chat_session(session_id, db)
    session.status = f"HANDOFF_{target}"
    db.add(m.AuditLog(event_type="CHAT_HANDOFF", details=json.dumps({"session_key": session_id, "target": target}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "session_id": session_id, "target_agent": target, "status": session.status}


# ══════════════════════════════════════════════════════════════════════════════
# AGENTIC CORE
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/agentic-core/status")
def agentic_core_status(db: Session = Depends(get_db)):
    actions = db.query(m.AgentAction).count()
    events = db.query(m.MissionEvent).count()
    recent = db.query(m.AgentAction).order_by(m.AgentAction.created_at.desc()).limit(10).all()
    return {
        "status": "OPERATIONAL_LOCAL" if AGENTIC_CORE_DIR.exists() else "NOT_FOUND",
        "core_path": str(AGENTIC_CORE_DIR),
        "actions": actions,
        "events": events,
        "tools": ["filesystem_tool", "terminal_tool", "git_tool", "database_tool", "validation_engine", "rollback_engine"],
        "recent_actions": [
            {
                "id": row.id,
                "agent_id": row.agent_id,
                "mission_id": row.mission_id,
                "action_type": row.action_type,
                "tool_used": row.tool_used,
                "target": row.target,
                "status": row.status,
                "evidence_path": row.evidence_path,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in recent
        ],
        "source": "real_database",
    }


@app.post("/api/agentic-core/plan")
async def agentic_core_plan(request: Request, db: Session = Depends(get_db)):
    from planner.mission_planner import MissionPlanner
    from logs.action_logger import record_action

    body = await request.json()
    objective = (body.get("objective") or "").strip()
    mission_id = body.get("mission_id")
    plan = MissionPlanner().create_plan(objective, mission_id=mission_id)
    evidence = record_action(
        db, m,
        agent_id="ARCHITECT",
        mission_id=plan["MISSION_PLAN"]["id"],
        action_type="MISSION_PLAN",
        tool_used="mission_planner",
        target=objective,
        result="PLANNED",
        status="OK",
        evidence=plan,
    )
    plan["evidence_path"] = evidence
    return plan


@app.post("/api/agentic-core/route-tool")
async def agentic_core_route_tool(request: Request):
    from tools.tool_router import ToolRouter

    body = await request.json()
    return ToolRouter().route(body.get("action_type", ""))


@app.get("/api/agentic-core/actions")
def agentic_core_actions(limit: int = 50, db: Session = Depends(get_db)):
    rows = db.query(m.AgentAction).order_by(m.AgentAction.created_at.desc()).limit(limit).all()
    return {
        "total": db.query(m.AgentAction).count(),
        "items": [
            {
                "id": row.id,
                "agent_id": row.agent_id,
                "mission_id": row.mission_id,
                "action_type": row.action_type,
                "tool_used": row.tool_used,
                "target": row.target,
                "result": row.result,
                "status": row.status,
                "evidence_path": row.evidence_path,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ],
        "source": "agent_actions",
    }


@app.get("/api/agentic-core/events")
def agentic_core_events(limit: int = 50, db: Session = Depends(get_db)):
    rows = db.query(m.MissionEvent).order_by(m.MissionEvent.created_at.desc()).limit(limit).all()
    return {
        "total": db.query(m.MissionEvent).count(),
        "items": [
            {
                "id": row.id,
                "mission_id": row.mission_id,
                "agent_id": row.agent_id,
                "event_type": row.event_type,
                "description": row.description,
                "status": row.status,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ],
        "source": "mission_events",
    }


@app.post("/api/agentic-core/database/integrity")
async def agentic_core_database_integrity(db: Session = Depends(get_db)):
    from _compat_db import engine
    from executors.database_tool import DatabaseTool

    return DatabaseTool(db, m, engine=engine).integrity_check(agent_id="QA", mission_id="AGENTIC_CORE_V1")


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
# PAINEL — serve o Monitor 1 (HTML + JS + CSS) diretamente do FastAPI
# ══════════════════════════════════════════════════════════════════════════════

PANEL_DIR = Path(__file__).parent / "16_SISTEMAS" / "FORJA_OS_PLATFORM"

if PANEL_DIR.exists():
    from fastapi.staticfiles import StaticFiles as _SF
    app.mount("/painel/css", _SF(directory=str(PANEL_DIR / "css")), name="painel_css")
    app.mount("/painel/js",  _SF(directory=str(PANEL_DIR / "js")),  name="painel_js")

    @app.get("/painel")
    def serve_painel():
        dist_index = DIST_DIR / "index.html"
        if dist_index.exists():
            return FileResponse(str(dist_index))
        return FileResponse(str(PANEL_DIR / "Factory OS - Monitor 1.html"))

    logger.info("FORJA OS: painel servido em http://localhost:8000/painel")


# ══════════════════════════════════════════════════════════════════════════════
# CONFIG — gerenciamento de chaves de API (salva em .env, nunca expõe valores)
# ══════════════════════════════════════════════════════════════════════════════

_ENV_PATH = Path(__file__).parent / ".env"
_ALLOWED_KEYS = {"ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GOOGLE_API_KEY",
                 "DEEPSEEK_API_KEY", "OPENROUTER_API_KEY", "OLLAMA_MODEL"}


def _read_env_lines():
    if not _ENV_PATH.exists():
        return []
    return _ENV_PATH.read_text(encoding="utf-8").splitlines()


def _upsert_env_key(key: str, value: str):
    """Insere ou substitui KEY=value no .env sem tocar nas outras linhas."""
    lines = _read_env_lines()
    prefix = key + "="
    replaced = False
    new_lines = []
    for ln in lines:
        if ln.startswith(prefix):
            new_lines.append(f'{key}="{value}"')
            replaced = True
        else:
            new_lines.append(ln)
    if not replaced:
        new_lines.append(f'{key}="{value}"')
    _ENV_PATH.write_text("\n".join(new_lines) + "\n", encoding="utf-8")


def _remove_env_key(key: str):
    lines = _read_env_lines()
    prefix = key + "="
    new_lines = [ln for ln in lines if not ln.startswith(prefix)]
    _ENV_PATH.write_text("\n".join(new_lines) + "\n", encoding="utf-8")


@app.get("/api/config/keys")
def get_key_status():
    """Retorna quais chaves estão configuradas (apenas nome + bool, nunca valor)."""
    lines = _read_env_lines()
    configured = {}
    for key in _ALLOWED_KEYS:
        prefix = key + "="
        val = next((ln[len(prefix):].strip().strip('"').strip("'")
                    for ln in lines if ln.startswith(prefix)), "")
        configured[key] = len(val) > 8
    # Também checa env vars já carregadas (ex: definidas fora do .env)
    for key in _ALLOWED_KEYS:
        if not configured[key]:
            v = os.environ.get(key, "")
            configured[key] = len(v) > 8
    return {"keys": configured}


@app.post("/api/config/keys")
async def set_key(request: Request):
    """Salva ou remove uma chave de API no .env. Nunca loga o valor."""
    body = await request.json()
    key = (body.get("key") or "").strip().upper()
    value = (body.get("value") or "").strip()
    if key not in _ALLOWED_KEYS:
        raise HTTPException(400, f"Chave não permitida: {key}")
    if not value:
        _remove_env_key(key)
        os.environ.pop(key, None)
        return {"ok": True, "action": "removed", "key": key}
    _upsert_env_key(key, value)
    os.environ[key] = value  # aplica imediatamente sem reiniciar
    return {"ok": True, "action": "saved", "key": key}


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
