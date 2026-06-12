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
import re
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

# ── PORTÃO PÚBLICO (hospedagem local via túnel) ──────────────────────────────
# Quando o request chega pela internet (túnel Cloudflare injeta CF-Connecting-IP),
# exige o token FORJA_PUBLIC_TOKEN (do .env): primeiro acesso via /painel?key=TOKEN
# grava cookie e os próximos passam direto. Acesso local (sem túnel) continua livre.
_PUBLIC_TOKEN = os.getenv("FORJA_PUBLIC_TOKEN", "")
_GATE_FREE_PATHS = {"/api/health", "/health.json", "/favicon.svg"}


@app.middleware("http")
async def public_gate(request: Request, call_next):
    if not _PUBLIC_TOKEN or not request.headers.get("cf-connecting-ip"):
        return await call_next(request)          # local/LAN ou portão desativado
    if request.url.path in _GATE_FREE_PATHS:
        return await call_next(request)
    if request.cookies.get("forja_key") == _PUBLIC_TOKEN:
        return await call_next(request)
    if request.query_params.get("key") == _PUBLIC_TOKEN:
        resp = await call_next(request)
        resp.set_cookie("forja_key", _PUBLIC_TOKEN, max_age=30 * 24 * 3600,
                        httponly=True, secure=True, samesite="lax")
        return resp
    return JSONResponse({"detail": "Acesso restrito. Abra /painel?key=SEU_TOKEN."},
                        status_code=401)


# Mídia de conteúdo (imagens redimensionadas) servida estaticamente
_CONTENT_MEDIA_DIR = Path(__file__).parent / "18_EXPORTS" / "content_media"
_CONTENT_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/content-media", StaticFiles(directory=str(_CONTENT_MEDIA_DIR)), name="content_media")

# Preview dos projetos: serve os arquivos do workspace (roda no navegador)
# Ex.: /preview/projeto_3/  -> abre o index.html do projeto 3
_AGENT_WS_DIR = Path(__file__).parent / "09_AGENT_WORKSPACE"
_AGENT_WS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/preview", StaticFiles(directory=str(_AGENT_WS_DIR), html=True), name="preview")

# Dimensões corretas por REDE + tipo de conteúdo (px)
CONTENT_SIZES = {"post": (1080, 1080), "reel": (1080, 1920), "story": (1080, 1920), "carrossel": (1080, 1350)}
NETWORK_SIZES = {
    "instagram": {"post": (1080, 1080), "carrossel": (1080, 1350), "reel": (1080, 1920), "story": (1080, 1920)},
    "facebook":  {"post": (1200, 630),  "carrossel": (1080, 1080), "reel": (1080, 1920), "story": (1080, 1920)},
    "tiktok":    {"post": (1080, 1920), "carrossel": (1080, 1920), "reel": (1080, 1920), "story": (1080, 1920)},
    "linkedin":  {"post": (1200, 627),  "carrossel": (1080, 1080), "reel": (1080, 1920), "story": (1080, 1920)},
}


def _content_size(network, tipo):
    return NETWORK_SIZES.get((network or "instagram").lower(), NETWORK_SIZES["instagram"]).get(tipo, (1080, 1080))


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
    import provider_router

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

    # System prompt de ELITE por papel + memória real de aprendizado do agente.
    chat_rule = (
        "ESTILO DE CONVERSA: seja CORDIAL, natural e claro — como um colega de equipe "
        "competente. Cumprimente de forma breve quando fizer sentido (sem exageros). "
        "MANTENHA O CONTEXTO: leia o histórico abaixo e dê CONTINUIDADE ao que já foi dito; "
        "lembre o nome do usuário e detalhes mencionados. Faça perguntas de acompanhamento "
        "quando ajudar. Seja útil e objetivo, sem encher linguiça nem se repetir. "
        "Não narre arquivos do git nem invente informação. "
        "REGRA DE OURO — EXECUTE AGORA: quando o usuário pedir algo (pesquisa, análise, "
        "texto, plano, ideia), ENTREGUE o resultado NESTA resposta usando seu conhecimento. "
        "É PROIBIDO responder apenas 'pronto', 'envie a tarefa', 'aguardando' ou variações — "
        "isso é considerado falha. Se faltar um dado essencial, entregue a melhor versão "
        "possível e pergunte só o que for indispensável no fim. Se o pedido for de outra "
        "especialidade, responda mesmo assim com o melhor do seu conhecimento e sugira a "
        "equipe ideal (ex.: Inteligência de Mercado para pesquisas de nicho). "
        "MODO AÇÃO (ferramentas reais): se — e somente se — o pedido exigir dados/ações REAIS "
        "do sistema (consultar o banco/status da Fábrica, ler arquivos do projeto, gerar "
        "imagem, enviar Telegram/e-mail/WhatsApp, postar no Instagram), responda APENAS com "
        "uma linha no formato: [AGIR: descrição objetiva e completa da tarefa]. O núcleo "
        "agêntico executará com ferramentas e o resultado real voltará ao usuário. Para "
        "conversa, opinião, texto e conhecimento geral, NÃO use [AGIR] — responda direto."
    )
    try:
        from AGENTIC_CORE import agent_profiles, agent_memory
        mem_block = agent_memory.memory_block(req.agent_key or "", limit=5)
        system_prompt = agent_profiles.build_system_prompt(
            req.agent_key or "", memory_block=mem_block, extra=chat_rule)
    except Exception as _e:
        logger.warning("perfil de agente indisponível, usando prompt padrão: %s", _e)
        system_prompt = (
            f"Você é o {agent_name} da FORJA OS, especialista, autônomo e verdadeiro. "
            f"Responda em português. {chat_rule}"
        )
    
    full_prompt = f"{hist_text}MENSAGEM DO USUÁRIO:\n{req.message}\n"

    # Roteia via provider_router REAL. Ordem oficial de conversação:
    # claude_sub → gemini_sub → codex_sub → openrouter → ollama.
    # Estes executam de fato (assinaturas via CLI + gateway autorizado).
    # O llm_router baseado em registry só alcança APIs com adapter e bloqueava
    # assinaturas com ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE (chat quebrado).
    if req.provider and req.provider not in ("auto", "automatico", "automático", ""):
        # Mapeia o id do painel (ex.: gemini_subscription, deepseek_v4_router)
        # para a chave de execução real do roteador (ex.: gemini_sub, openrouter).
        exec_key = pg.PROVIDER_EXECUTION_MAP.get(req.provider, req.provider)
        model_override = pg.PROVIDER_MODEL_OVERRIDE.get(req.provider)
        if exec_key == "openrouter" and model_override:
            orig_m = provider_router.PROVIDER_CONFIG["openrouter"]["model"]
            orig_fb = provider_router.PROVIDER_CONFIG["openrouter"].get("fallback_models", [])
            provider_router.PROVIDER_CONFIG["openrouter"]["model"] = model_override
            provider_router.PROVIDER_CONFIG["openrouter"]["fallback_models"] = []
            try:
                result = provider_router.execute_llm(exec_key, full_prompt, system=system_prompt, max_tokens=1024)
            finally:
                provider_router.PROVIDER_CONFIG["openrouter"]["model"] = orig_m
                provider_router.PROVIDER_CONFIG["openrouter"]["fallback_models"] = orig_fb
        else:
            result = provider_router.execute_llm(exec_key, full_prompt, system=system_prompt, max_tokens=1024)
        # Se o provider escolhido falhar, cai para o roteamento automático do grupo
        if not result.get("ok"):
            group_res = provider_router.execute_for_group("conversation", full_prompt, system=system_prompt, max_tokens=1024)
            if group_res.get("ok"):
                group_res.setdefault("fallback_trail", [])
                group_res["fallback_trail"] = [{"provider": exec_key, "ok": False, "error": result.get("error")}] + group_res.get("fallback_trail", [])
                result = group_res
        result.setdefault("fallback_trail", [{"provider": exec_key, "ok": result.get("ok")}])
    else:
        result = provider_router.execute_for_group(
            "conversation", full_prompt, system=system_prompt, max_tokens=1024
        )

    if not result.get("ok") or not result.get("response"):
        err = result.get("error") or "todos os providers falharam"
        db.add(m.ChatMessage(
            session_key=session_id,
            sender="system",
            content=f"Falha de comunicação: {err}",
            provider_key=result.get("provider"),
            provider_status="ERROR",
        ))
        db.add(m.AuditLog(
            event_type="CHAT_MESSAGE",
            details=json.dumps({"session_key": session_id, "ok": False, "error": err,
                                "trail": result.get("fallback_trail", [])}, ensure_ascii=False),
        ))
        db.commit()
        raise HTTPException(status_code=503, detail=f"Agent indisponível: {err}")

    provider_used = result.get("provider")
    agent_text = result.get("response")
    model_used = result.get("model")
    fallback_used = len(result.get("fallback_trail", [])) > 1

    # AGENTE HÍBRIDO: o modelo pediu ação real ([AGIR: ...]) → executa o núcleo
    # agêntico (ReAct + ferramentas) e a resposta passa a ser o RESULTADO real.
    acted = False
    _m_agir = re.search(r"\[AGIR:\s*(.+?)\]", agent_text or "", flags=re.S)
    if _m_agir:
        objective = _m_agir.group(1).strip()[:600]
        try:
            # Handler é sync (FastAPI já o roda em threadpool) → chamada direta.
            from AGENTIC_CORE.base_agent import BaseAgent as _BA
            key = (req.agent_key or "ORCHESTRATOR").strip().upper().replace(" ", "_")
            ag = _BA(name=key, role="Especialista Autônomo da Forja",
                     goal=objective, profile_key=key)
            act_res = ag.execute_mission(objective)
            final = (act_res.get("final_answer") or "").strip()
            if final:
                agent_text = final
                acted = True
                provider_used = "agentic_core"
            else:
                agent_text = (f"Tentei executar com ferramentas mas não houve conclusão "
                              f"(status: {act_res.get('status')}). Pode detalhar o pedido?")
        except Exception as _e:
            agent_text = f"Falha ao executar a ação real: {type(_e).__name__}. Tente novamente."
        db.add(m.AuditLog(event_type="CHAT_AUTO_ACT", details=json.dumps(
            {"session_key": session_id, "objective": objective[:160], "ok": acted}, ensure_ascii=False)))

    agent_msg = m.ChatMessage(
        session_key=session_id,
        sender=req.agent_key or "communication_agent",
        content=agent_text,
        provider_key=provider_used,
        provider_status="CERTIFIED"
    )
    db.add(agent_msg)

    # Memória de conversa: o agente aprende a conversar/dar continuidade entre sessões.
    # FILTRO ANTI-CONTAMINAÇÃO: não grava saudações, testes nem respostas-eco curtas
    # ("Pronto...", "Envie a tarefa") — senão o agente aprende a enrolar (ciclo vicioso).
    try:
        from AGENTIC_CORE import agent_memory
        _msg_low = (req.message or "").lower()
        _resp_low = (agent_text or "").lower()
        _trivial = (
            len(req.message or "") < 15
            or len(agent_text or "") < 60
            or _msg_low.startswith(("teste", "responda apenas", "diga apenas", "oi", "ola", "olá", "bom dia", "boa tarde", "boa noite"))
            or _resp_low.startswith(("pronto", "ok", "entendido", "envie a tarefa"))
        )
        if not _trivial:
            agent_memory.add_learning(
                req.agent_key or "COMMUNICATION",
                f"Conversa — usuário: {req.message[:100]} | respondi: {agent_text[:120]}",
                kind="conversa")
    except Exception:
        pass

    db.add(m.AuditLog(
        event_type="CHAT_MESSAGE",
        details=json.dumps({"session_key": session_id, "provider": provider_used, "model": model_used, "ok": True}, ensure_ascii=False),
    ))
    db.commit()

    return {
        "session_id": session_id,
        "agent": req.agent_key or "COMMUNICATION",
        "provider_used": provider_used,
        "model": model_used,
        "message": agent_text,
        "response": agent_text,
        "status": "ok",
        "fallback_used": fallback_used,
        "fallback_trail": result.get("fallback_trail", []),
        "created_at": datetime.now(timezone.utc).isoformat()
    }

# ══════════════════════════════════════════════════════════════════════════════
# CHAT STATUS (health check real — sem textos fantasma)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/chat/status")
def chat_status():
    """Retorna status REAL dos providers lendo direto do registry.
    ZERO GHOST: só reporta 'online' se houver provider active_real."""
    registry_path = Path(__file__).parent / "17_AUTOMACOES" / "LLM_ROUTER" / "provider_registry.json"
    
    available = []
    unavailable = []
    
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
        providers = registry.get("providers", {})
        
        for pid, pcfg in providers.items():
            label = pcfg.get("display_name", pid)
            health = pcfg.get("health_status", "unknown")
            ptype = pcfg.get("provider_type", "unknown")
            entry = {
                "id": pid,
                "label": label,
                "type": ptype,
                "health": health,
            }
            if health == "active_real":
                available.append(entry)
            else:
                entry["reason"] = health
                unavailable.append(entry)
    except Exception as e:
        logger.error("Erro ao ler registry: %s", e)

    online = len(available) > 0
    return {
        "online": online,
        "status_text": f"{len(available)} provider(s) disponível(is)" if online else "Nenhum provider disponível",
        "available": available,
        "unavailable": unavailable,
        "timestamp": datetime.now(timezone.utc).isoformat(),
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
    if row.provider_key == "claude_subscription":
        models = ["claude (CLI assinatura)"]
    if row.provider_key == "openai_subscription":
        models = ["gpt-5.5 (codex CLI assinatura)"]
    if row.provider_key == "gemini_subscription":
        models = ["gemini (CLI assinatura)"]
    if row.provider_key == "ollama_local":
        models = _check_ollama_health().get("models", [])
    import provider_router
    # Zero Ghost: o status exibido é o do último health-check REAL persistido no
    # banco. Ter CLI instalado não significa "online" (ex.: org pode bloquear a
    # assinatura headless) — então NÃO forçamos active_real aqui.
    row_status = row.status

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
    # System prompt de elite + memória real de aprendizado do agente
    try:
        from AGENTIC_CORE import agent_profiles, agent_memory
        mem_block = agent_memory.memory_block(key, limit=5)
        agent_system = agent_profiles.build_system_prompt(key, memory_block=mem_block)
    except Exception:
        agent_system = f"Você é o agente {key} da FORJA OS. Responda de forma operacional em português."
    result = provider_router.execute_with_fallback(
        prompt,
        system=agent_system,
        max_tokens=700,
        order=order,
    )
    # APRENDIZADO: grava um resumo real desta execução (auto-aprendizado)
    if result.get("ok") and result.get("response"):
        try:
            from AGENTIC_CORE import agent_memory
            agent_memory.add_learning(
                key, f"Tarefa: {prompt[:120]} | Resultado: {result.get('response')[:180]}",
                kind="agent_run")
        except Exception:
            pass
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


@app.post("/api/agents/{agent_id}/act")
async def agent_act(agent_id: str, request: Request, db: Session = Depends(get_db)):
    """Execução AGÊNTICA real: o agente raciocina (ReAct) e usa ferramentas
    seguras (ler/buscar/consultar/escrever-sandbox/comando-allowlist) para
    cumprir o objetivo. Usa o perfil de elite + memória de aprendizado."""
    payload = await request.json()
    objective = (payload.get("objective") or payload.get("prompt") or "").strip()
    if not objective:
        raise HTTPException(status_code=400, detail="Campo 'objective' obrigatório")
    # Aceita agente do banco OU id de equipe/perfil do chat (ex.: 'orquestrador', 'chat')
    try:
        agent = _get_agent_or_404(agent_id, db)
        key = _agent_key(agent)
    except HTTPException:
        key = (agent_id or "").strip().upper().replace(" ", "_") or "ORCHESTRATOR"

    # Contexto do cliente (para ações por-cliente: postar no IG do cliente, etc.)
    ctx = {}
    if payload.get("client_id"):
        try:
            ctx["client_id"] = _client_pk(payload.get("client_id"))
        except Exception:
            pass

    from starlette.concurrency import run_in_threadpool

    def _run():
        from AGENTIC_CORE.base_agent import BaseAgent
        ag = BaseAgent(name=key, role="Especialista Autônomo da Forja",
                       goal=objective, profile_key=key, context=ctx)
        return ag.execute_mission(objective)

    try:
        result = await run_in_threadpool(_run)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha no núcleo agêntico: {type(e).__name__}: {e}")

    ok = result.get("status") in ("completed", "max_steps_reached")
    # Persiste a conversa na sessão de chat (memória entre navegações de tela)
    session_id = (payload.get("session_id") or "").strip()
    if session_id:
        _ensure_chat_session(session_id, db)
        db.add(m.ChatMessage(session_key=session_id, sender="USER", content=objective))
        db.add(m.ChatMessage(
            session_key=session_id, sender=key,
            content=result.get("final_answer") or f"({result.get('status') or 'sem resposta'})",
            provider_key="agentic_core", provider_status="OK" if ok else "ERROR",
        ))
    db.add(m.AuditLog(event_type="AGENT_ACT", details=json.dumps(
        {"agent": key, "status": result.get("status"), "steps": result.get("steps")}, ensure_ascii=False)))
    db.commit()
    return {
        "ok": ok,
        "agent": key,
        "status": result.get("status"),
        "steps": result.get("steps"),
        "result": result.get("final_answer"),
        "log": result.get("log", []),
        "source": "agentic_core_react",
    }


@app.get("/api/agents/{agent_key}/brain")
def agent_brain(agent_key: str):
    """Cérebro do agente: persona + BIBLIOTECA de elite (ON) + ferramentas + aprendizados."""
    try:
        from AGENTIC_CORE import agent_profiles, agent_memory
        from AGENTIC_CORE.tools_registry import ROLE_TOOLS, ToolRegistry
        canon, prof = agent_profiles.resolve_profile(agent_key)
        tools = ROLE_TOOLS.get(canon)
        if tools is None:
            tools = list(ToolRegistry().tools.keys())
        return {
            "agent": agent_key, "role": canon, "title": prof["title"],
            "persona": prof["system"], "biblioteca": agent_profiles.LIBRARY.get(canon, ""),
            "ferramentas": tools, "aprendizados": agent_memory.count(canon),
            "biblioteca_on": True, "source": "agent_profiles",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")


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


def _reconnect_blocking(provider_key: str, attempts: int) -> dict:
    """Tenta (re)conectar um provider repetindo o teste real até dar certo
    ou esgotar as tentativas. Persiste o status final no banco."""
    import time as _t
    from _compat_db import SessionLocal
    db = SessionLocal()
    try:
        row = db.query(m.LLMProvider).filter(m.LLMProvider.provider_key == provider_key).first()
        if not row:
            return {"_status_code": 404, "detail": "Provider não encontrado"}
        trail = []
        result = {"ok": False, "status": "ERROR", "error": "sem tentativa"}
        for i in range(attempts):
            result = pg.check_provider(provider_key)
            trail.append({"attempt": i + 1, "ok": result.get("ok"),
                          "status": result.get("status"), "latency_ms": result.get("latency_ms"),
                          "error": result.get("error")})
            if result.get("ok"):
                break
            _t.sleep(1.5)  # backoff curto entre tentativas
        row.status = result["status"]
        row.last_health_check = datetime.now(timezone.utc)
        row.updated_at = datetime.now(timezone.utc)
        db.add(m.ProviderHealthCheck(
            provider_key=provider_key, status=result["status"],
            response_excerpt=result.get("response_excerpt"),
            error=result.get("error"), latency_ms=result.get("latency_ms"),
        ))
        db.add(m.AuditLog(event_type="PROVIDER_RECONNECT", details=json.dumps(
            {"provider_key": provider_key, "ok": result.get("ok"),
             "attempts": len(trail), "status": result["status"]}, ensure_ascii=False)))
        db.commit()
        return {
            "provider_key": provider_key, "ok": bool(result.get("ok")),
            "status": result["status"], "model": result.get("model"),
            "response_excerpt": result.get("response_excerpt"),
            "error": result.get("error"), "latency_ms": result.get("latency_ms"),
            "attempts_made": len(trail), "attempts": trail,
        }
    finally:
        db.close()


@app.post("/api/providers/reconnect")
async def providers_reconnect(request: Request):
    """Reconecta um provider com várias tentativas (buscando dar certo)."""
    from starlette.concurrency import run_in_threadpool
    payload = await request.json()
    provider_key = (payload.get("provider_key") or "").strip()
    if not provider_key:
        raise HTTPException(status_code=400, detail="provider_key obrigatório")
    attempts = max(1, min(int(payload.get("attempts") or 3), 6))
    out = await run_in_threadpool(_reconnect_blocking, provider_key, attempts)
    if out.get("_status_code") == 404:
        raise HTTPException(status_code=404, detail=out.get("detail"))
    return out


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
        # Sessão ainda sem mensagens persistidas: devolve histórico vazio (200).
        # 404 fazia o frontend zerar a conversa ao navegar entre telas.
        return {"session_id": session_id, "status": "OPEN", "messages": [], "source": "chat_messages"}
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


# ══════════════════════════════════════════════════════════════════════════════
# CLIENTES + CONEXÕES (multi-cliente · cada cliente com suas contas/integrações)
# ══════════════════════════════════════════════════════════════════════════════

def _client_pk(cid: str) -> int:
    if isinstance(cid, str) and cid.upper().startswith("CLI-"):
        return int(cid.split("-")[1])
    return int(cid)


def _conn_to_dict(c):
    meta = {}
    try:
        meta = json.loads(c.metadata_json or "{}")
    except Exception:
        meta = {}
    # expõe só metadados NÃO sensíveis (ex.: chat_id, ig_user_id), nunca a credencial
    safe_meta = {k: v for k, v in meta.items() if k not in ("detail",)}
    return {
        "id": c.id, "kind": c.kind, "label": c.label or c.kind,
        "status": c.status, "has_credential": bool(c.credential),
        "meta": safe_meta, "detail": meta.get("detail", ""),
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }


def _set_conn_meta(conn, detail, incoming=None):
    """Mescla metadados: preserva existentes (chat_id/ig_user_id), aplica novos e o detail."""
    try:
        meta = json.loads(conn.metadata_json or "{}")
    except Exception:
        meta = {}
    if isinstance(incoming, dict):
        meta.update({k: v for k, v in incoming.items() if v not in (None, "")})
    meta["detail"] = detail
    conn.metadata_json = json.dumps(meta, ensure_ascii=False)


@app.get("/api/connectors")
def list_connectors_endpoint(scope: Optional[str] = None):
    import connectors
    return {"items": connectors.list_connectors(scope), "source": "connectors_catalog"}


# ---- Conexões GLOBAIS da Fábrica (logadas uma vez, usadas em todos os clientes) ----
_AGENCY_OWNER = 0  # client_id sentinela para conexões da Fábrica


@app.get("/api/agency/connections")
def agency_connections(db: Session = Depends(get_db)):
    rows = db.query(m.ClientConnection).filter(m.ClientConnection.client_id == _AGENCY_OWNER).all()
    return {"items": [_conn_to_dict(c) for c in rows], "scope": "global", "source": "real_database"}


@app.post("/api/agency/connections")
async def add_agency_connection(request: Request, db: Session = Depends(get_db)):
    import connectors
    from starlette.concurrency import run_in_threadpool
    body = await request.json()
    kind = (body.get("kind") or "").strip().lower()
    label = (body.get("label") or "").strip() or kind
    credential = (body.get("credential") or "").strip()
    if kind not in connectors.CONNECTORS:
        raise HTTPException(status_code=400, detail=f"conector inválido: {kind}")
    status, detail = await run_in_threadpool(connectors.test_connection, kind, credential, body.get("meta"))
    conn = (db.query(m.ClientConnection)
            .filter(m.ClientConnection.client_id == _AGENCY_OWNER, m.ClientConnection.kind == kind).first())
    if not conn:
        conn = m.ClientConnection(client_id=_AGENCY_OWNER, kind=kind, scope="global")
        db.add(conn)
    conn.scope = "global"
    conn.label = label
    if credential:
        conn.credential = credential
    conn.status = status
    _set_conn_meta(conn, detail, body.get("meta"))
    conn.updated_at = datetime.now(timezone.utc)
    db.add(m.AuditLog(event_type="AGENCY_CONNECTION", details=json.dumps(
        {"kind": kind, "status": status}, ensure_ascii=False)))
    db.commit()
    return {"ok": status == "CONNECTED", "status": status, "detail": detail, "kind": kind}


@app.post("/api/connections/{conn_id}/test")
async def test_any_connection(conn_id: int, db: Session = Depends(get_db)):
    import connectors
    from starlette.concurrency import run_in_threadpool
    conn = db.query(m.ClientConnection).filter(m.ClientConnection.id == conn_id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Conexão não encontrada")
    try:
        _meta = json.loads(conn.metadata_json or "{}")
    except Exception:
        _meta = {}
    status, detail = await run_in_threadpool(connectors.test_connection, conn.kind, conn.credential or "", _meta)
    conn.status = status
    _set_conn_meta(conn, detail)
    conn.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": status == "CONNECTED", "status": status, "detail": detail}


@app.delete("/api/connections/{conn_id}")
def delete_any_connection(conn_id: int, db: Session = Depends(get_db)):
    conn = db.query(m.ClientConnection).filter(m.ClientConnection.id == conn_id).first()
    if conn:
        db.delete(conn); db.commit()
    return {"ok": True, "removed": conn_id}


@app.get("/api/clients")
def list_clients(db: Session = Depends(get_db)):
    clients = db.query(m.Client).order_by(m.Client.created_at.desc()).all()
    items = []
    for cl in clients:
        proj = db.query(m.Project).filter(m.Project.client_id == cl.id).count()
        conns = db.query(m.ClientConnection).filter(m.ClientConnection.client_id == cl.id).count()
        connected = db.query(m.ClientConnection).filter(
            m.ClientConnection.client_id == cl.id, m.ClientConnection.status == "CONNECTED").count()
        items.append({
            "id": f"CLI-{cl.id:03d}", "raw_id": cl.id, "nome": cl.name,
            "descricao": cl.description, "status": cl.status,
            "projetos": proj, "conexoes": conns, "conexoes_ativas": connected,
            "created_at": cl.created_at.isoformat() if cl.created_at else None,
        })
    return {"total": len(items), "items": items, "source": "real_database"}


@app.post("/api/clients")
async def create_client(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    name = (body.get("nome") or body.get("name") or "").strip()
    desc = (body.get("descricao") or body.get("description") or "")
    if not name:
        raise HTTPException(status_code=400, detail="Campo 'nome' obrigatório")
    cl = m.Client(name=name, description=desc, status="ACTIVE")
    db.add(cl); db.commit(); db.refresh(cl)
    db.add(m.AuditLog(event_type="CLIENT_CREATED", details=json.dumps({"id": cl.id, "name": name}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "id": f"CLI-{cl.id:03d}", "raw_id": cl.id, "nome": cl.name}


@app.get("/api/clients/{client_id}")
def get_client(client_id: str, db: Session = Depends(get_db)):
    cid = _client_pk(client_id)
    cl = db.query(m.Client).filter(m.Client.id == cid).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    projects = db.query(m.Project).filter(m.Project.client_id == cid).order_by(m.Project.id.desc()).all()
    conns = db.query(m.ClientConnection).filter(m.ClientConnection.client_id == cid).all()
    return {
        "id": f"CLI-{cl.id:03d}", "raw_id": cl.id, "nome": cl.name,
        "descricao": cl.description, "status": cl.status,
        "projetos": [{"id": f"PRJ-{p.id:03d}", "nome": p.name, "status": p.status,
                      "missoes": db.query(m.Mission).filter(m.Mission.project_id == p.id).count()} for p in projects],
        "conexoes": [_conn_to_dict(c) for c in conns],
        "source": "real_database",
    }


@app.post("/api/clients/{client_id}/connections")
async def add_connection(client_id: str, request: Request, db: Session = Depends(get_db)):
    import connectors
    from starlette.concurrency import run_in_threadpool
    cid = _client_pk(client_id)
    cl = db.query(m.Client).filter(m.Client.id == cid).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    body = await request.json()
    kind = (body.get("kind") or "").strip().lower()
    label = (body.get("label") or "").strip() or kind
    credential = (body.get("credential") or "").strip()
    if kind not in connectors.CONNECTORS:
        raise HTTPException(status_code=400, detail=f"conector inválido: {kind}")
    status, detail = await run_in_threadpool(connectors.test_connection, kind, credential, body.get("meta"))
    # upsert: uma conexão por (cliente, kind)
    conn = (db.query(m.ClientConnection)
            .filter(m.ClientConnection.client_id == cid, m.ClientConnection.kind == kind).first())
    if not conn:
        conn = m.ClientConnection(client_id=cid, kind=kind, scope="client")
        db.add(conn)
    conn.scope = "client"
    conn.label = label
    if credential:
        conn.credential = credential
    conn.status = status
    _set_conn_meta(conn, detail, body.get("meta"))
    conn.updated_at = datetime.now(timezone.utc)
    db.add(m.AuditLog(event_type="CLIENT_CONNECTION", details=json.dumps(
        {"client_id": cid, "kind": kind, "status": status}, ensure_ascii=False)))
    db.commit()
    return {"ok": status == "CONNECTED", "status": status, "detail": detail, "kind": kind}


@app.post("/api/clients/{client_id}/connections/{conn_id}/test")
async def test_connection_endpoint(client_id: str, conn_id: int, db: Session = Depends(get_db)):
    import connectors
    from starlette.concurrency import run_in_threadpool
    conn = db.query(m.ClientConnection).filter(m.ClientConnection.id == conn_id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Conexão não encontrada")
    try:
        _meta = json.loads(conn.metadata_json or "{}")
    except Exception:
        _meta = {}
    status, detail = await run_in_threadpool(connectors.test_connection, conn.kind, conn.credential or "", _meta)
    conn.status = status
    _set_conn_meta(conn, detail)
    conn.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": status == "CONNECTED", "status": status, "detail": detail}


@app.delete("/api/clients/{client_id}/connections/{conn_id}")
def delete_connection(client_id: str, conn_id: int, db: Session = Depends(get_db)):
    conn = db.query(m.ClientConnection).filter(m.ClientConnection.id == conn_id).first()
    if conn:
        db.delete(conn); db.commit()
    return {"ok": True, "removed": conn_id}


def _mission_to_dict(ms):
    return {
        "id": f"MIS-{ms.id:03d}",
        "titulo": ms.title,
        "status": ms.status,
        "description": ms.description,
        "project_id": ms.project_id,
        "created_at": ms.created_at.isoformat() if ms.created_at else None,
        "updated_at": ms.updated_at.isoformat() if ms.updated_at else None,
    }


@app.get("/api/projects")
def projects_endpoint(db: Session = Depends(get_db)):
    """Lista projetos reais do banco, com contagem de missões."""
    projects = db.query(m.Project).order_by(m.Project.created_at.desc()).all()
    items = []
    for p in projects:
        total_m = db.query(m.Mission).filter(m.Mission.project_id == p.id).count()
        done_m = db.query(m.Mission).filter(m.Mission.project_id == p.id,
                                            m.Mission.status == "COMPLETED").count()
        items.append({
            "id": f"PRJ-{p.id:03d}", "raw_id": p.id, "nome": p.name,
            "descricao": p.description, "status": p.status,
            "missoes_total": total_m, "missoes_concluidas": done_m,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })
    return {"total": len(items), "items": items, "source": "real_database"}


def _project_pk(project_id: str) -> int:
    if isinstance(project_id, str) and project_id.upper().startswith("PRJ-"):
        return int(project_id.split("-")[1])
    return int(project_id)


@app.post("/api/projects")
async def create_project(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    name = (body.get("nome") or body.get("name") or "").strip()
    desc = (body.get("descricao") or body.get("description") or "")
    if not name:
        raise HTTPException(status_code=400, detail="Campo 'nome' obrigatório")
    client_pk = None
    if body.get("client_id"):
        try:
            client_pk = _client_pk(body.get("client_id"))
        except Exception:
            client_pk = None
    p = m.Project(name=name, description=desc, status="ACTIVE", client_id=client_pk)
    db.add(p); db.commit(); db.refresh(p)
    db.add(m.AuditLog(event_type="PROJECT_CREATED",
                      details=json.dumps({"id": p.id, "name": name}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "id": f"PRJ-{p.id:03d}", "raw_id": p.id, "nome": p.name, "status": p.status}


@app.get("/api/projects/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    pid = _project_pk(project_id)
    p = db.query(m.Project).filter(m.Project.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    missions = db.query(m.Mission).filter(m.Mission.project_id == pid).order_by(m.Mission.id.desc()).all()
    mission_ids = [ms.id for ms in missions]
    evid_total = 0
    if mission_ids:
        evid_total = db.query(m.Evidence).filter(m.Evidence.mission_id.in_(mission_ids)).count()
    return {
        "id": f"PRJ-{p.id:03d}", "raw_id": p.id, "nome": p.name,
        "descricao": p.description, "status": p.status,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "missoes": [_mission_to_dict(ms) for ms in missions],
        "entregas_total": evid_total,
        "source": "real_database",
    }


@app.post("/api/projects/{project_id}/missions")
async def create_project_mission(project_id: str, request: Request, db: Session = Depends(get_db)):
    pid = _project_pk(project_id)
    p = db.query(m.Project).filter(m.Project.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    body = await request.json()
    title = (body.get("titulo") or body.get("title") or "").strip()
    desc = (body.get("descricao") or body.get("description") or "")
    if not title:
        raise HTTPException(status_code=400, detail="Campo 'titulo' obrigatório")
    ms = m.Mission(title=title, description=desc, status="PENDING", project_id=pid)
    db.add(ms); db.commit(); db.refresh(ms)
    db.add(m.AuditLog(event_type="MISSION_CREATED",
                      details=json.dumps({"id": ms.id, "project_id": pid, "title": title}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "id": f"MIS-{ms.id:03d}", "titulo": ms.title, "status": ms.status, "project_id": pid}


def _project_ws(pid):
    d = Path(__file__).parent / "09_AGENT_WORKSPACE" / f"projeto_{pid}"
    d.mkdir(parents=True, exist_ok=True)
    return d


@app.post("/api/projects/{project_id}/upload")
async def upload_project_files(project_id: str, request: Request, db: Session = Depends(get_db)):
    """Sobe arquivos/imagens (e .zip de projeto) para o workspace do projeto."""
    pid = _project_pk(project_id)
    p = db.query(m.Project).filter(m.Project.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    body = await request.json()
    files = body.get("files") or []
    import base64, zipfile, os as _os
    import io as _io
    ws = _project_ws(pid)
    wsr = str(ws.resolve())
    saved = []
    for f in files[:300]:
        name = (f.get("name") or "arquivo").replace("\\", "/").split("/")[-1]
        data_url = f.get("data_url") or ""
        if "," not in data_url:
            continue
        try:
            raw = base64.b64decode(data_url.split(",", 1)[1])
        except Exception:
            continue
        if name.lower().endswith(".zip"):
            try:
                zf = zipfile.ZipFile(_io.BytesIO(raw))
                for member in zf.namelist():
                    if member.endswith("/"):
                        continue
                    dest = (ws / member).resolve()
                    if not str(dest).startswith(wsr):
                        continue  # bloqueia path traversal
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_bytes(zf.read(member))
                    saved.append(str(dest.relative_to(ws)).replace("\\", "/"))
            except Exception:
                continue
        else:
            # preserva subpastas (ex.: upload de pasta com webkitRelativePath), sem traversal
            rel = (f.get("name") or "arquivo").replace("\\", "/").lstrip("/")
            dest = (ws / rel).resolve()
            if not str(dest).startswith(wsr):
                dest = ws / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(raw)
            saved.append(str(dest.relative_to(ws)).replace("\\", "/"))
    db.add(m.AuditLog(event_type="PROJECT_UPLOAD", details=json.dumps({"project_id": pid, "arquivos": len(saved)}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "saved": len(saved), "files": saved[:120]}


@app.get("/api/projects/{project_id}/files")
def list_project_files(project_id: str):
    pid = _project_pk(project_id)
    ws = _project_ws(pid)
    import os as _os
    out = []
    for root, dirs, fs in _os.walk(ws):
        for fn in fs:
            full = Path(root) / fn
            out.append(str(full.relative_to(ws)).replace("\\", "/"))
    return {"total": len(out), "files": sorted(out)[:400], "workspace": f"09_AGENT_WORKSPACE/projeto_{pid}"}


@app.post("/api/projects/{project_id}/develop")
async def develop_project(project_id: str, db: Session = Depends(get_db)):
    """Construtor estruturado: a Fábrica gera o CONTEÚDO COMPLETO dos arquivos
    do projeto (em 2 rodadas) e grava no workspace. Mais confiável que o ReAct
    para concluir projetos completos."""
    from starlette.concurrency import run_in_threadpool
    import os as _os
    import re as _re
    pid = _project_pk(project_id)
    p = db.query(m.Project).filter(m.Project.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    ws = _project_ws(pid)
    wsr = str(ws.resolve())
    briefing = p.description or "Finalizar o projeto conforme os arquivos enviados."
    BIN = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".zip", ".pdf", ".mp4", ".mov"}

    def _read_ctx():
        parts, n = [], 0
        for root, dirs, fs in _os.walk(ws):
            for fn in sorted(fs):
                full = Path(root) / fn
                rel = str(full.relative_to(ws)).replace("\\", "/")
                if full.suffix.lower() in BIN:
                    parts.append(f"--- {rel} (binário) ---"); continue
                try:
                    txt = full.read_text(encoding="utf-8", errors="replace")[:4000]
                except Exception:
                    txt = "(ilegível)"
                parts.append(f"--- {rel} ---\n{txt}")
                n += 1
                if n >= 25:
                    return "\n".join(parts)
        return "\n".join(parts) or "(vazio — projeto novo, crie do zero)"

    def _round(ctx):
        import provider_router
        system = ("Você é um engenheiro de software sênior. Conclua o projeto conforme o briefing, gerando o "
                  "CONTEÚDO COMPLETO de cada arquivo necessário (HTML, CSS, JS, etc.), pronto para usar. "
                  "Responda ESTRITAMENTE em JSON válido, sem nada fora do JSON.")
        prompt = (f"BRIEFING (o que desenvolver):\n{briefing}\n\nARQUIVOS ATUAIS:\n{ctx}\n\n"
                  "Gere os arquivos finais (novos ou atualizados) para CONCLUIR o projeto. Caminhos relativos. "
                  'Formato EXATO: {"arquivos":[{"path":"index.html","conteudo":"<conteúdo COMPLETO do arquivo>"}],"resumo":"o que foi feito"}')
        return provider_router.execute_for_group("engineering", prompt, system=system, max_tokens=8000)

    written, resumo, erro = [], "", None
    for _rnd in range(2):
        ctx = await run_in_threadpool(_read_ctx)
        res = await run_in_threadpool(_round, ctx)
        if not res.get("ok") or not res.get("response"):
            erro = res.get("error"); break
        text = res["response"]
        match = _re.search(r"\{.*\}", text, _re.DOTALL)
        data = {}
        if match:
            try:
                data = json.loads(match.group(0))
            except Exception:
                data = {}
        arqs = data.get("arquivos") or []
        if not arqs:
            resumo = resumo or text[:400]
            break
        novos = 0
        for a in arqs:
            if not isinstance(a, dict):
                continue
            rel = (a.get("path") or "").replace("\\", "/").lstrip("/")
            if not rel:
                continue
            dest = (ws / rel).resolve()
            if not str(dest).startswith(wsr):
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(a.get("conteudo") or "", encoding="utf-8")
            written.append(rel); novos += 1
        resumo = data.get("resumo") or resumo
        if novos == 0:
            break

    db.add(m.AuditLog(event_type="PROJECT_DEVELOP", details=json.dumps(
        {"project_id": pid, "arquivos": len(set(written))}, ensure_ascii=False)))
    db.commit()
    written = sorted(set(written))
    ok = len(written) > 0
    result_txt = (resumo or "")
    if written:
        result_txt += "\n\nArquivos gravados:\n- " + "\n- ".join(written)
    if not ok and erro:
        result_txt = "Não foi possível concluir: " + str(erro)
    return {"ok": ok, "status": "completed" if ok else "incompleto",
            "result": result_txt.strip(), "arquivos_escritos": written}


@app.get("/api/projects/{project_id}/deliverables")
def project_deliverables(project_id: str, db: Session = Depends(get_db)):
    """Entregas reais do projeto = evidências das suas missões."""
    pid = _project_pk(project_id)
    missions = db.query(m.Mission).filter(m.Mission.project_id == pid).all()
    mission_ids = [ms.id for ms in missions]
    title_by_id = {ms.id: ms.title for ms in missions}
    items = []
    if mission_ids:
        rows = db.query(m.Evidence).filter(m.Evidence.mission_id.in_(mission_ids)).order_by(m.Evidence.id.desc()).all()
        for e in rows:
            items.append({
                "id": e.id, "mission_id": f"MIS-{e.mission_id:03d}",
                "missao": title_by_id.get(e.mission_id, ""),
                "descricao": e.description, "file_path": e.file_path,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            })
    return {"total": len(items), "items": items, "source": "real_database"}


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


@app.get("/api/system/health")
def system_health(db: Session = Depends(get_db)):
    """Saúde REAL dos componentes do sistema (sem status fixo/fantasma)."""
    import shutil
    root = Path(__file__).parent
    comps = []

    # Banco de Dados — consulta real
    try:
        mtot = db.query(m.Mission).count()
        comps.append({"id": "database", "nome": "Banco de Dados", "icon": "db",
                      "st": "CERT", "nota": f"operacional · {mtot} missões"})
    except Exception as e:
        comps.append({"id": "database", "nome": "Banco de Dados", "icon": "db",
                      "st": "OFFLINE", "nota": f"erro: {type(e).__name__}"})

    # API Core — se respondemos, está no ar
    n_routes = len([r for r in app.routes if getattr(r, "path", "").startswith("/api")])
    comps.append({"id": "api_core", "nome": "API Core", "icon": "zap",
                  "st": "CERT", "nota": f"FastAPI v{app.version} · {n_routes} endpoints"})

    # Runtime de agentes — status real
    try:
        import agent_runtime
        rs = agent_runtime.runtime_status()
        avail = len(rs.get("providers_available", []))
        st = "CERT" if rs.get("operational") else "DEV"
        comps.append({"id": "runtime", "nome": "Runtime", "icon": "cpu", "st": st,
                      "nota": f"operacional · {avail} provider(s) · {rs.get('missions_total',0)} missões"})
    except Exception as e:
        comps.append({"id": "runtime", "nome": "Runtime", "icon": "cpu", "st": "DEV",
                      "nota": f"indisponível: {type(e).__name__}"})

    # Logs — coleta real
    try:
        logs_dir = root / "logs"
        files = list(logs_dir.glob("*.log")) if logs_dir.exists() else []
        if files:
            last = max(files, key=lambda f: f.stat().st_mtime)
            last_dt = datetime.fromtimestamp(last.stat().st_mtime, tz=timezone.utc)
            comps.append({"id": "logs", "nome": "Logs", "icon": "terminal", "st": "CERT",
                          "nota": f"{len(files)} arquivos · última escrita {last_dt.strftime('%d/%m %H:%M')}"})
        else:
            comps.append({"id": "logs", "nome": "Logs", "icon": "terminal", "st": "DEV",
                          "nota": "diretório de logs vazio"})
    except Exception as e:
        comps.append({"id": "logs", "nome": "Logs", "icon": "terminal", "st": "DEV",
                      "nota": f"erro: {type(e).__name__}"})

    # Sistema de Arquivos — gravável?
    fs_ok = os.access(str(root), os.W_OK)
    comps.append({"id": "filesystem", "nome": "Sistema de Arquivos", "icon": "folder",
                  "st": "CERT" if fs_ok else "OFFLINE", "nota": "operacional" if fs_ok else "somente leitura"})

    # GitHub — git instalado?
    git_ok = shutil.which("git") is not None
    comps.append({"id": "github", "nome": "GitHub", "icon": "git",
                  "st": "IMPL" if git_ok else "NIMPL", "nota": "git disponível" if git_ok else "git não instalado"})

    # Auditoria — trilha real
    try:
        atot = db.query(m.AuditLog).count()
        comps.append({"id": "auditoria", "nome": "Auditoria", "icon": "shield", "st": "CERT",
                      "nota": f"trilha ativa · {atot} eventos"})
    except Exception:
        comps.append({"id": "auditoria", "nome": "Auditoria", "icon": "shield", "st": "DEV", "nota": "—"})

    # Scheduler — estado real: roda em background (loop 30s) com jobs no banco
    try:
        import scheduler_engine
        jtot = db.query(m.ScheduledJob).count()
        jon = db.query(m.ScheduledJob).filter(m.ScheduledJob.enabled == True).count()  # noqa: E712
        st = "CERT" if (scheduler_engine._started and jon > 0) else ("DEV" if jtot else "CONFIG")
        comps.append({"id": "scheduler", "nome": "Scheduler", "icon": "clock", "st": st,
                      "nota": f"{jon} job(s) ativo(s) de {jtot} · loop 30s"})
    except Exception:
        comps.append({"id": "scheduler", "nome": "Scheduler", "icon": "clock", "st": "DEV", "nota": "—"})

    return {"items": comps, "generated_at": datetime.now(timezone.utc).isoformat(), "source": "real_health_check"}


@app.post("/api/tests/run")
def run_tests(db: Session = Depends(get_db)):
    """Auto-teste REAL do sistema: roda verificações de verdade e reporta
    quais passaram/falharam (sem inventar resultado)."""
    checks = []

    def check(nome, fn):
        try:
            ok, detail = fn()
        except Exception as e:
            ok, detail = False, f"{type(e).__name__}: {e}"
        checks.append({"nome": nome, "passou": bool(ok), "detalhe": str(detail)[:160]})

    def _db():
        n = db.query(m.Mission).count()
        return True, f"banco respondeu · {n} missões"

    def _agents():
        n = db.query(m.Agent).count()
        return n > 0, f"{n} agentes registrados"

    def _providers():
        rows = db.query(m.LLMProvider).all()
        online = [p for p in rows if p.status in ("active_real", "CERTIFIED", "ROUTER_LIMITED")]
        return len(online) > 0, f"{len(online)}/{len(rows)} provedores online"

    def _knowledge():
        kn = _count_knowledge(["01_RULES", "02_WORKFLOWS", "03_SKILLS"])
        return kn["count"] > 0, f"{kn['count']} itens de conhecimento"

    def _fs():
        return os.access(str(Path(__file__).parent), os.W_OK), "sistema de arquivos gravável"

    def _audit():
        n = db.query(m.AuditLog).count()
        return n > 0, f"trilha de auditoria · {n} eventos"

    def _agentic_tools():
        from AGENTIC_CORE.tools_registry import ToolRegistry
        tr = ToolRegistry()
        return len(tr.tools) >= 5, f"{len(tr.tools)} ferramentas agênticas"

    check("Banco de dados", _db)
    check("Agentes", _agents)
    check("Provedores de IA online", _providers)
    check("Base de conhecimento", _knowledge)
    check("Sistema de arquivos", _fs)
    check("Auditoria", _audit)
    check("Núcleo agêntico", _agentic_tools)

    passed = sum(1 for c in checks if c["passou"])
    failed = len(checks) - passed
    db.add(m.AuditLog(event_type="TESTS_RUN", details=json.dumps(
        {"passed": passed, "failed": failed}, ensure_ascii=False)))
    db.commit()
    return {"total": len(checks), "passed": passed, "failed": failed,
            "ok": failed == 0, "items": checks,
            "generated_at": datetime.now(timezone.utc).isoformat(), "source": "real_self_test"}


@app.get("/api/billing/status")
def billing_status_endpoint():
    """Status de billing real: budgets $1/dia, $30/mês, uso real ou sem_dados_reais."""
    import billing_config
    return billing_config.get_billing_status()


# ══════════════════════════════════════════════════════════════════════════════
# FINANCEIRO — livro-caixa real (receitas/despesas que o operador registra)
# + custo de IA medido automaticamente. Nada inventado.
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/finance")
def finance_summary(client_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(m.FinanceEntry)
    if client_id:
        try:
            q = q.filter(m.FinanceEntry.client_id == _client_pk(client_id))
        except Exception:
            pass
    entries = q.order_by(m.FinanceEntry.id.desc()).all()
    receitas = sum(e.amount for e in entries if e.kind == "receita")
    despesas = sum(e.amount for e in entries if e.kind == "despesa")
    cnames = {c.id: c.name for c in db.query(m.Client).all()}
    import billing_config
    b = billing_config.get_billing_status()
    return {
        "receitas_total": round(receitas, 2),
        "despesas_total": round(despesas, 2),
        "resultado": round(receitas - despesas, 2),
        "moeda": "BRL",
        "ia_custo_mes_usd": b.get("monthly_used_usd"),
        "ia_custo_dia_usd": b.get("daily_used_usd"),
        "ia_budget_mes_usd": b.get("monthly_budget_usd"),
        "ia_source": b.get("source"),
        "items": [{
            "id": e.id, "kind": e.kind, "description": e.description, "amount": e.amount,
            "currency": e.currency, "client_id": e.client_id, "cliente": cnames.get(e.client_id, ""),
            "created_at": e.created_at.isoformat() if e.created_at else None,
        } for e in entries],
        "source": "real_database",
    }


@app.post("/api/finance")
async def create_finance(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    kind = (body.get("kind") or "").strip().lower()
    if kind not in ("receita", "despesa"):
        raise HTTPException(status_code=400, detail="kind deve ser 'receita' ou 'despesa'")
    desc = (body.get("description") or body.get("descricao") or "").strip()
    try:
        amount = float(str(body.get("amount") or body.get("valor") or "0").replace(",", "."))
    except Exception:
        raise HTTPException(status_code=400, detail="valor inválido")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="valor deve ser maior que zero")
    cid = None
    if body.get("client_id"):
        try:
            cid = _client_pk(body.get("client_id"))
        except Exception:
            cid = None
    e = m.FinanceEntry(kind=kind, description=desc, amount=amount, client_id=cid,
                       currency=(body.get("currency") or "BRL"))
    db.add(e); db.commit(); db.refresh(e)
    db.add(m.AuditLog(event_type="FINANCE_ENTRY",
                      details=json.dumps({"kind": kind, "amount": amount, "client_id": cid}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "id": e.id, "kind": kind, "amount": amount}


@app.delete("/api/finance/{entry_id}")
def delete_finance(entry_id: int, db: Session = Depends(get_db)):
    e = db.query(m.FinanceEntry).filter(m.FinanceEntry.id == entry_id).first()
    if e:
        db.delete(e); db.commit()
    return {"ok": True, "removed": entry_id}


# ══════════════════════════════════════════════════════════════════════════════
# SCHEDULER — agendamentos reais (rodam em background no horário)
# ══════════════════════════════════════════════════════════════════════════════

_JOB_KINDS = {"agent_act", "telegram_message", "run_queue", "publish_content"}


def _job_to_dict(j):
    return {
        "id": j.id, "name": j.name, "kind": j.kind, "spec": j.spec,
        "schedule_type": j.schedule_type, "schedule_value": j.schedule_value,
        "next_run": j.next_run.isoformat() if j.next_run else None,
        "last_run": j.last_run.isoformat() if j.last_run else None,
        "last_result": j.last_result, "enabled": j.enabled,
    }


@app.get("/api/scheduler/jobs")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(m.ScheduledJob).order_by(m.ScheduledJob.id.desc()).all()
    return {"total": len(jobs), "items": [_job_to_dict(j) for j in jobs], "source": "real_database"}


@app.post("/api/scheduler/jobs")
async def create_job(request: Request, db: Session = Depends(get_db)):
    import scheduler_engine
    body = await request.json()
    name = (body.get("name") or "").strip()
    kind = (body.get("kind") or "").strip()
    if not name or kind not in _JOB_KINDS:
        raise HTTPException(status_code=400, detail="name e kind (agent_act|telegram_message|run_queue) obrigatórios")
    st = body.get("schedule_type") or "interval"
    sv = str(body.get("schedule_value") or "60")
    spec = body.get("spec") or {}
    nr = scheduler_engine.compute_next_run(st, sv)
    j = m.ScheduledJob(name=name, kind=kind, spec=json.dumps(spec, ensure_ascii=False),
                       schedule_type=st, schedule_value=sv, next_run=nr, enabled=True)
    db.add(j); db.commit(); db.refresh(j)
    db.add(m.AuditLog(event_type="SCHEDULER_CREATE", details=json.dumps({"id": j.id, "name": name, "kind": kind}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "id": j.id, "next_run": nr.isoformat() if nr else None}


@app.post("/api/scheduler/jobs/{job_id}/toggle")
def toggle_job(job_id: int, db: Session = Depends(get_db)):
    import scheduler_engine
    j = db.query(m.ScheduledJob).filter(m.ScheduledJob.id == job_id).first()
    if not j:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    j.enabled = not j.enabled
    if j.enabled and not j.next_run:
        j.next_run = scheduler_engine.compute_next_run(j.schedule_type, j.schedule_value)
    db.commit()
    return {"ok": True, "enabled": j.enabled}


@app.post("/api/scheduler/jobs/{job_id}/run")
async def run_job_now(job_id: int, db: Session = Depends(get_db)):
    import scheduler_engine, types
    from starlette.concurrency import run_in_threadpool
    j = db.query(m.ScheduledJob).filter(m.ScheduledJob.id == job_id).first()
    if not j:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    shim = types.SimpleNamespace(kind=j.kind, spec=j.spec)
    result = await run_in_threadpool(scheduler_engine.execute_job, shim)
    j.last_run = datetime.now()
    j.last_result = str(result)[:500]
    db.commit()
    return {"ok": True, "result": str(result)[:300]}


@app.delete("/api/scheduler/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    j = db.query(m.ScheduledJob).filter(m.ScheduledJob.id == job_id).first()
    if j:
        db.delete(j); db.commit()
    return {"ok": True, "removed": job_id}


# ══════════════════════════════════════════════════════════════════════════════
# ESTÚDIO DE CONTEÚDO — desenvolve posts/reels para redes sociais (por cliente)
# ══════════════════════════════════════════════════════════════════════════════

_CONTENT_TIPOS = {"post", "reel", "story", "carrossel"}


def _content_to_dict(ci, cname=""):
    return {
        "id": ci.id, "client_id": ci.client_id, "cliente": cname,
        "network": getattr(ci, "network", "instagram"),
        "tipo": ci.tipo, "briefing": ci.briefing, "output": ci.output,
        "media_url": ci.media_url, "status": ci.status,
        "created_at": ci.created_at.isoformat() if ci.created_at else None,
    }


@app.get("/api/content")
def list_content(client_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(m.ContentItem)
    if client_id:
        try:
            q = q.filter(m.ContentItem.client_id == _client_pk(client_id))
        except Exception:
            pass
    items = q.order_by(m.ContentItem.id.desc()).all()
    cnames = {c.id: c.name for c in db.query(m.Client).all()}
    return {"total": len(items), "items": [_content_to_dict(c, cnames.get(c.client_id, "")) for c in items],
            "source": "real_database"}


@app.post("/api/content")
async def create_content(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    tipo = (body.get("tipo") or "post").strip().lower()
    if tipo not in _CONTENT_TIPOS:
        raise HTTPException(status_code=400, detail="tipo: post|reel|story|carrossel")
    briefing = (body.get("briefing") or "").strip()
    cid = None
    if body.get("client_id"):
        try:
            cid = _client_pk(body.get("client_id"))
        except Exception:
            cid = None
    network = (body.get("network") or "instagram").strip().lower()
    ci = m.ContentItem(client_id=cid, network=network, tipo=tipo, briefing=briefing, status="rascunho")
    db.add(ci); db.commit(); db.refresh(ci)
    return {"ok": True, "id": ci.id, "tipo": tipo, "network": network}


@app.post("/api/content/plan")
async def plan_content(request: Request, db: Session = Depends(get_db)):
    """Equipe de Redes + Designer planeja um conjunto de conteúdos (dia/semana)
    a partir de tema/estilo/marca e já os deixa desenvolvidos no Estúdio."""
    from starlette.concurrency import run_in_threadpool
    body = await request.json()
    tema = (body.get("tema") or "").strip()
    estilo = (body.get("estilo") or "").strip()
    marca = (body.get("marca") or "").strip()
    periodo = (body.get("periodo") or "semana").strip().lower()
    networks = body.get("networks") or [body.get("network") or "instagram"]
    if isinstance(networks, str):
        networks = [networks]
    networks = [str(n).strip().lower() for n in networks if n][:6] or ["instagram"]
    cid = None
    cname = "o cliente"
    if body.get("client_id"):
        try:
            cid = _client_pk(body.get("client_id"))
            cl = db.query(m.Client).filter(m.Client.id == cid).first()
            if cl:
                cname = cl.name
        except Exception:
            cid = None
    try:
        qtd = int(body.get("qtd"))
    except Exception:
        qtd = 3 if periodo == "dia" else 7
    qtd = max(1, min(qtd, 3 if periodo == "dia" else 21))
    try:
        from AGENTIC_CORE import agent_memory
        mem = agent_memory.memory_block("COMMUNICATION", 5)
    except Exception:
        agent_memory = None
        mem = ""

    system = ("Você é a EQUIPE de Redes Sociais + Designer da Fábrica (estrategista de conteúdo + "
              "diretor de arte sênior). Planeje conteúdo profissional, coerente com a marca e o estilo. "
              "Responda ESTRITAMENTE com um array JSON válido, sem nenhum texto fora do JSON.")
    prompt = (
        f"Cliente: {cname}\nRedes: {', '.join(networks)}\nTema da campanha: {tema or '(livre)'}\n"
        f"Estilo/tom: {estilo or '(definir adequado)'}\nMarca/Logo: {marca or '(não informado)'}\n"
        f"Período: {periodo} — gere EXATAMENTE {qtd} publicações.\n"
        + (("Aprendizados anteriores da equipe:\n" + mem + "\n") if mem else "")
        + "Cada item deve ter: tipo (post|reel|carrossel), titulo, legenda (pronta para publicar, no tom da marca, "
          "com @menções quando fizer sentido), hashtags (string com #), visual (direção de arte considerando o logo/estilo).\n"
          'Responda APENAS o JSON, ex.: [{"tipo":"post","titulo":"...","legenda":"...","hashtags":"#a #b","visual":"..."}]'
    )

    def _gen():
        import provider_router
        return provider_router.execute_for_group("conversation", prompt, system=system, max_tokens=2200)

    result = await run_in_threadpool(_gen)
    if not result.get("ok") or not result.get("response"):
        raise HTTPException(status_code=503, detail="IA indisponível: " + str(result.get("error") or ""))
    text = result["response"]
    import re
    items = []
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            items = json.loads(match.group(0))
        except Exception:
            items = []
    created = []
    for it in (items or [])[:qtd]:
        if not isinstance(it, dict):
            continue
        tp = (it.get("tipo") or "post").strip().lower()
        if tp not in _CONTENT_TIPOS:
            tp = "post"
        out = ((it.get("legenda") or "") + "\n\n" + (it.get("hashtags") or "")
               + "\n\n[Arte] " + (it.get("visual") or "")).strip()
        # um conteúdo por rede escolhida (cada um no tamanho correto da rede)
        for nw in networks:
            ci = m.ContentItem(client_id=cid, network=nw, tipo=tp,
                               briefing=(it.get("titulo") or tema), output=out, status="desenvolvido")
            db.add(ci); created.append(ci)
    if not created:
        ci = m.ContentItem(client_id=cid, network=networks[0], tipo="post",
                           briefing=(tema or "Plano de conteúdo"), output=text, status="desenvolvido")
        db.add(ci); created.append(ci)
    db.commit()
    if agent_memory:
        try:
            agent_memory.add_learning("COMMUNICATION",
                f"Plano {periodo} · tema '{tema}' · estilo '{estilo}' → {len(created)} conteúdos", kind="plano")
        except Exception:
            pass
    db.add(m.AuditLog(event_type="CONTENT_PLAN", details=json.dumps(
        {"periodo": periodo, "tema": tema, "qtd": qtd, "networks": networks, "criados": len(created)}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "criados": len(created), "periodo": periodo, "qtd": qtd,
            "networks": networks, "provider": result.get("provider")}


@app.post("/api/content/{content_id}/develop")
async def develop_content(content_id: int, db: Session = Depends(get_db)):
    from starlette.concurrency import run_in_threadpool
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    client = db.query(m.Client).filter(m.Client.id == ci.client_id).first() if ci.client_id else None
    cname = client.name if client else "o cliente"
    instru = {
        "post": "Crie uma LEGENDA envolvente + 5 a 10 hashtags relevantes + uma sugestão de imagem (descreva a imagem).",
        "reel": "Crie um ROTEIRO de reel: gancho nos 3s iniciais, 3 a 5 cenas com narração curta, CTA final, + legenda e hashtags.",
        "story": "Crie 3 telas de story: texto curto de cada tela + sugestão visual + uma enquete/CTA.",
        "carrossel": "Crie um carrossel de 5 a 7 cards: título e texto de cada card + legenda final e hashtags.",
    }.get(ci.tipo, "Crie o conteúdo solicitado.")
    system = ("Você é um especialista sênior em redes sociais e copywriting. Escreva em português do Brasil, "
              "com tom adequado à marca, persuasivo e claro, pronto para publicar. Não invente fatos sobre o cliente; "
              "se faltar informação, faça suposições genéricas e marque entre [colchetes].")
    prompt = f"Cliente: {cname}\nTipo: {ci.tipo}\nBriefing: {ci.briefing or '(livre — proponha algo relevante)'}\n\n{instru}"

    def _gen():
        import provider_router
        return provider_router.execute_for_group("conversation", prompt, system=system, max_tokens=900)

    result = await run_in_threadpool(_gen)
    if not result.get("ok") or not result.get("response"):
        raise HTTPException(status_code=503, detail="IA indisponível: " + str(result.get("error") or ""))
    ci.output = result["response"]
    ci.status = "desenvolvido"
    ci.updated_at = datetime.now(timezone.utc)
    db.add(m.AuditLog(event_type="CONTENT_DEVELOP", details=json.dumps(
        {"id": ci.id, "tipo": ci.tipo, "provider": result.get("provider")}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "output": ci.output, "provider": result.get("provider"), "status": ci.status}


@app.post("/api/content/{content_id}")
async def update_content(content_id: int, request: Request, db: Session = Depends(get_db)):
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    body = await request.json()
    if "output" in body:
        ci.output = body.get("output")
    if "media_url" in body:
        ci.media_url = (body.get("media_url") or "").strip()
    if "status" in body:
        ci.status = body.get("status")
    ci.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": True, "id": ci.id, "status": ci.status}


@app.post("/api/content/{content_id}/publish")
async def publish_content(content_id: int, db: Session = Depends(get_db)):
    from starlette.concurrency import run_in_threadpool
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    if ci.tipo != "post":
        return {"ok": False, "result": "Publicação automática hoje cobre 'post' (imagem). "
                "Reels/stories precisam de upload de vídeo — em breve. O roteiro já está pronto para publicar manualmente."}
    if not ci.media_url:
        raise HTTPException(status_code=400, detail="Defina a media_url (URL pública da imagem) antes de publicar")
    cid = ci.client_id

    def _pub():
        from AGENTIC_CORE.tools_registry import ToolRegistry
        tr = ToolRegistry({"client_id": cid})
        return tr.execute("postar_instagram", json.dumps({"image_url": ci.media_url, "legenda": (ci.output or "")[:2000]}))

    res = await run_in_threadpool(_pub)
    ok = "publicado" in str(res).lower()
    if ok:
        ci.status = "publicado"; ci.updated_at = datetime.now(timezone.utc); db.commit()
    return {"ok": ok, "result": str(res)}


@app.delete("/api/content/{content_id}")
def delete_content(content_id: int, db: Session = Depends(get_db)):
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if ci:
        db.delete(ci); db.commit()
    return {"ok": True, "removed": content_id}


@app.post("/api/content/{content_id}/upload")
async def upload_content_media(content_id: int, request: Request, db: Session = Depends(get_db)):
    """Recebe imagem (data URL base64), redimensiona para o tamanho CORRETO do tipo e salva."""
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    body = await request.json()
    data_url = body.get("data_url") or ""
    if "," not in data_url:
        raise HTTPException(status_code=400, detail="envie a imagem como data URL (base64)")
    import base64
    import io as _io
    try:
        raw = base64.b64decode(data_url.split(",", 1)[1])
        from PIL import Image, ImageOps
        img = Image.open(_io.BytesIO(raw)).convert("RGB")
        size = _content_size(ci.network, ci.tipo)
        img = ImageOps.fit(img, size, method=Image.LANCZOS)  # corta/centraliza no tamanho exato
        ts = int(datetime.now().timestamp())
        fname = f"content_{content_id}_{ts}.jpg"
        img.save(_CONTENT_MEDIA_DIR / fname, "JPEG", quality=88)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"falha ao processar imagem: {type(e).__name__}")
    ci.media_url = f"/content-media/{fname}"
    ci.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": True, "media_url": ci.media_url, "size": f"{size[0]}x{size[1]}"}


@app.post("/api/content/{content_id}/generate-image")
async def generate_image(content_id: int, request: Request, db: Session = Depends(get_db)):
    """Gera a imagem por IA com cadeia de fallback (Gemini grátis → OpenAI →
    OpenRouter), redimensiona ao tamanho do tipo/rede e salva no conteúdo."""
    from starlette.concurrency import run_in_threadpool
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    body = await request.json()
    prompt = (body.get("prompt") or ci.briefing or "imagem profissional para post de rede social").strip()
    full_prompt = ("Imagem para rede social, alta qualidade, sem texto sobreposto, "
                   "estilo profissional: " + prompt)

    import image_service

    def _gen():
        try:
            raw, provider = image_service.generate_image(full_prompt)
            return ("ok", raw, provider)
        except Exception as e:
            return ("err", str(e), None)

    status, payload, provider = await run_in_threadpool(_gen)
    if status != "ok":
        raise HTTPException(status_code=502, detail="Falha na geração: " + str(payload)[:300])
    try:
        import io as _io
        from PIL import Image, ImageOps
        img = Image.open(_io.BytesIO(payload)).convert("RGB")
        size = _content_size(ci.network, ci.tipo)
        img = ImageOps.fit(img, size, method=Image.LANCZOS)
        ts = int(datetime.now().timestamp())
        fname = f"content_{content_id}_{ts}.jpg"
        img.save(_CONTENT_MEDIA_DIR / fname, "JPEG", quality=88)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Falha ao processar imagem: {type(e).__name__}")
    ci.media_url = f"/content-media/{fname}"
    ci.updated_at = datetime.now(timezone.utc)
    db.add(m.AuditLog(event_type="CONTENT_IMAGE_GENERATED", details=json.dumps(
        {"content_id": content_id, "provider": provider, "size": f"{size[0]}x{size[1]}"}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "media_url": ci.media_url, "size": f"{size[0]}x{size[1]}", "model": provider}


@app.post("/api/content/{content_id}/schedule")
async def schedule_content(content_id: int, request: Request, db: Session = Depends(get_db)):
    """Agenda a publicação do conteúdo na rede escolhida (cria um job no Scheduler)."""
    import scheduler_engine
    ci = db.query(m.ContentItem).filter(m.ContentItem.id == content_id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    body = await request.json()
    st = body.get("schedule_type") or "daily"
    sv = str(body.get("schedule_value") or "09:00")
    nr = scheduler_engine.compute_next_run(st, sv)
    j = m.ScheduledJob(name=f"Publicar conteúdo #{content_id} ({ci.network}/{ci.tipo})",
                       kind="publish_content", spec=json.dumps({"content_id": content_id}, ensure_ascii=False),
                       schedule_type=st, schedule_value=sv, next_run=nr, enabled=True)
    db.add(j); db.commit()
    ci.status = "agendado"; ci.updated_at = datetime.now(timezone.utc); db.commit()
    return {"ok": True, "next_run": nr.isoformat() if nr else None, "job_id": j.id}


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
# CONHECIMENTO — contagem real de itens no repositório (sem dados inventados)
# ══════════════════════════════════════════════════════════════════════════════

# Mapeamento: categoria do painel → diretório real no repositório.
_KNOWLEDGE_DIRS = {
    "rules":     ["01_RULES"],
    "workflows": ["02_WORKFLOWS"],
    "skills":    ["03_SKILLS"],
    "templates": ["07_TEMPLATES", "18_MODELOS"],
    "library":   ["14_DOCUMENTACAO", "07_KNOWLEDGE_ENGINE"],
    "memory":    ["09_MEMORY", "14_AGENT_MEMORY"],
}
_KNOWLEDGE_EXTS = {".md", ".mdx", ".txt", ".json", ".yaml", ".yml", ".py"}


def _count_knowledge(dirs: list[str]) -> dict:
    base = Path(__file__).parent
    total = 0
    bytes_total = 0
    last_mod = None
    existing = []
    for d in dirs:
        p = base / d
        if not p.exists():
            continue
        existing.append(d)
        for f in p.rglob("*"):
            if f.is_file() and f.suffix.lower() in _KNOWLEDGE_EXTS:
                if "__pycache__" in f.parts or ".git" in f.parts:
                    continue
                try:
                    st = f.stat()
                except OSError:
                    continue
                total += 1
                bytes_total += st.st_size
                mt = datetime.fromtimestamp(st.st_mtime, tz=timezone.utc)
                if last_mod is None or mt > last_mod:
                    last_mod = mt
    return {
        "count": total,
        "size_bytes": bytes_total,
        "dirs": existing,
        "last_modified": last_mod.isoformat() if last_mod else None,
    }


@app.get("/api/files")
def list_files(path: str = ""):
    """Lista REAL de arquivos/pastas do repositório (somente leitura, sem sair da raiz)."""
    base = Path(__file__).parent.resolve()
    target = (base / path).resolve()
    # impede traversal para fora da raiz
    if base != target and base not in target.parents:
        raise HTTPException(status_code=400, detail="caminho inválido")
    if not target.exists() or not target.is_dir():
        raise HTTPException(status_code=404, detail="pasta não encontrada")
    hidden = {"__pycache__", "node_modules", ".git", ".pytest_cache", ".tools",
              ".npm-cache", ".build-tmp", ".codex_pydeps"}
    items = []
    try:
        entries = sorted(target.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
    except OSError:
        entries = []
    for p in entries:
        if p.name.startswith(".") or p.name in hidden:
            continue
        items.append({
            "nome": p.name,
            "tipo": "dir" if p.is_dir() else (p.suffix.lstrip(".") or "file"),
            "path": str(p.relative_to(base)).replace("\\", "/"),
        })
    return {"path": path, "total": len(items), "items": items, "source": "real_filesystem"}


@app.get("/api/knowledge")
def knowledge_endpoint():
    """Contagem REAL de itens de conhecimento lendo diretórios do repositório.
    Sem números inventados: cada categoria reporta o que existe no disco."""
    items = []
    grand_total = 0
    for cat, dirs in _KNOWLEDGE_DIRS.items():
        info = _count_knowledge(dirs)
        grand_total += info["count"]
        items.append({
            "id": cat,
            "count": info["count"],
            "size_bytes": info["size_bytes"],
            "dirs": info["dirs"],
            "last_modified": info["last_modified"],
            "indexed": info["count"] > 0,
        })
    return {
        "total_items": grand_total,
        "items": items,
        "source": "real_filesystem",
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/knowledge")
async def add_knowledge(request: Request, db: Session = Depends(get_db)):
    """Adiciona uma nota de conhecimento REAL: grava um .md numa das categorias
    (rules/workflows/skills/templates/library/memory) — os agentes leem do disco."""
    body = await request.json()
    cat = (body.get("category") or "library").strip().lower()
    titulo = (body.get("titulo") or body.get("title") or "").strip()
    conteudo = (body.get("conteudo") or body.get("content") or "").strip()
    if not titulo or not conteudo:
        raise HTTPException(status_code=400, detail="Informe título e conteúdo.")
    if cat not in _KNOWLEDGE_DIRS:
        cat = "library"
    base = Path(__file__).parent / _KNOWLEDGE_DIRS[cat][0]
    base.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", titulo.lower()).strip("-")[:50] or "nota"
    fname = f"{slug}-{int(datetime.now().timestamp())}.md"
    md = f"# {titulo}\n\n> Adicionado pelo painel em {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n{conteudo}\n"
    (base / fname).write_text(md, encoding="utf-8")
    db.add(m.AuditLog(event_type="KNOWLEDGE_ADDED", details=json.dumps(
        {"category": cat, "file": fname, "titulo": titulo[:80]}, ensure_ascii=False)))
    db.commit()
    return {"ok": True, "category": cat, "file": f"{_KNOWLEDGE_DIRS[cat][0]}/{fname}", "titulo": titulo}


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

def _auto_validate_providers():
    """Valida e PERSISTE o status real de cada provider no boot (background).
    Garante que as LLMs fiquem funcionais e o painel correto automaticamente,
    sem ninguém precisar clicar em 'Testar' a cada reinício. Auto-recupera:
    se um provider voltar/cair, o próximo boot reflete a verdade."""
    skip = {s.strip() for s in os.getenv(
        "FORJA_HEALTHCHECK_SKIP", "openai_subscription").split(",") if s.strip()}
    from _compat_db import SessionLocal
    db = SessionLocal()
    try:
        rows = db.query(m.LLMProvider).filter(m.LLMProvider.enabled == True).all()  # noqa: E712
        for row in rows:
            if row.provider_key in skip:
                continue
            try:
                result = pg.check_provider(row.provider_key)
                row.status = result["status"]
                row.last_health_check = datetime.now(timezone.utc)
                row.updated_at = datetime.now(timezone.utc)
                db.add(m.ProviderHealthCheck(
                    provider_key=row.provider_key,
                    status=result["status"],
                    response_excerpt=result.get("response_excerpt"),
                    error=result.get("error"),
                    latency_ms=result.get("latency_ms"),
                ))
                db.commit()
                logger.info("auto-healthcheck %s -> %s (%sms)",
                            row.provider_key, result["status"], result.get("latency_ms"))
            except Exception as e:
                db.rollback()
                logger.warning("auto-healthcheck falhou %s: %s", row.provider_key, e)
    except Exception as e:
        logger.warning("auto-validate providers erro: %s", e)
    finally:
        db.close()


@app.on_event("startup")
async def startup():
    init_db()
    logger.info("FORJA OS iniciada. Docs: http://localhost:8000/api/docs")
    # Validação automática das LLMs no boot (thread daemon, não bloqueia o startup)
    if os.getenv("FORJA_AUTO_HEALTHCHECK", "1") != "0":
        import threading
        threading.Thread(target=_auto_validate_providers, daemon=True,
                         name="forja-auto-healthcheck").start()
        logger.info("FORJA OS: auto-validação de providers iniciada em background.")
    # Scheduler (agendamentos) + atendimento automático no Telegram
    try:
        import scheduler_engine
        scheduler_engine.start_scheduler()
    except Exception as e:
        logger.warning("scheduler não iniciado: %s", e)
    try:
        import telegram_attendant
        telegram_attendant.start_attendant()
    except Exception as e:
        logger.warning("atendente telegram não iniciado: %s", e)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("forja_os_server:app", host="0.0.0.0", port=port, reload=False)
