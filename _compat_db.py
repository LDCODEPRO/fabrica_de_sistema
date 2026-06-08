"""
_compat_db.py — Shim de compatibilidade para o banco de dados.
Resolve o problema de importar módulos com números (20_OPERATIONAL_CORE).
"""
import os
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{Path(__file__).parent / 'nexus.db'}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializa o banco criando tabelas que não existem ainda."""
    import _compat_models as models
    Base.metadata.create_all(bind=engine)
    _seed_v006_governance(models)


def _seed_v006_governance(models):
    """Seed idempotente da governança V006 sem apagar dados existentes."""
    from datetime import datetime

    db = SessionLocal()
    try:
        providers = [
            ("claude_subscription", "Claude Assinatura", "SUBSCRIPTION_PROVIDER", 1, True, "ENVIRONMENT_PENDING", "CLI_OR_SESSION", "SUBSCRIPTION", "conversation", {}),
            ("openai_subscription", "OpenAI Assinatura", "SUBSCRIPTION_PROVIDER", 2, True, "ENVIRONMENT_PENDING", "APP_OR_CLI_SESSION", "SUBSCRIPTION", "engineering", {}),
            ("gemini_subscription", "Gemini Assinatura", "SUBSCRIPTION_PROVIDER", 3, True, "ENVIRONMENT_PENDING", "CLI_OR_BROWSER_SESSION", "SUBSCRIPTION", "general", {"evidence": "GEMINI_ASSINATURA_OK"}),
            ("deepseek_v4_router", "DeepSeek V4 Pro via Router", "ROUTER_PROVIDER", 4, True, "ENVIRONMENT_PENDING", "ROUTER_KEY", "ROUTER_CONTROLLED", "router", {"model": "deepseek/deepseek-v4-pro"}),
            ("kimi_k26_router", "Kimi K2.6 via Router", "ROUTER_PROVIDER", 5, True, "ENVIRONMENT_PENDING", "ROUTER_KEY", "ROUTER_CONTROLLED", "router", {"model": "moonshotai/kimi-k2.6"}),
            ("ollama_local", "Ollama Local", "LOCAL_PROVIDER", 6, True, "ENVIRONMENT_PENDING", "LOCAL_DAEMON", "FREE_LOCAL", "local", {}),
        ]
        for key, name, ptype, prio, enabled, status, auth, cost, group, meta in providers:
            row = db.query(models.LLMProvider).filter(models.LLMProvider.provider_key == key).first()
            if not row:
                row = models.LLMProvider(provider_key=key, created_at=datetime.utcnow())
                db.add(row)
            row.display_name = name
            row.provider_type = ptype
            row.priority = prio
            row.enabled = enabled
            row.status = status if row.status in (None, "", "ERROR") else row.status
            row.auth_mode = auth
            row.cost_mode = cost
            row.router_group = group
            row.metadata_json = __import__("json").dumps(meta, ensure_ascii=False)
            row.updated_at = datetime.utcnow()

        agents = {
            "COMMUNICATION": "Agente de comunicação operacional",
            "SUPPORT": "Agente de suporte operacional",
            "COMMERCIAL": "Agente comercial",
            "ORCHESTRATOR": "Coordena missões e dependências",
            "ARCHITECT": "Define arquitetura de solução",
            "DEVELOPER": "Implementa código e integrações",
            "QA": "Valida qualidade e testes",
            "DOCS": "Documenta decisões e entregas",
            "ANALYST": "Analisa dados, requisitos e contexto",
            "DESIGNER": "Apoia experiência visual e produto",
            "SECURITY": "Audita segurança e segredos",
            "DEVOPS": "Opera deploy, ambiente e automação",
            "DATA_ENGINEER": "Cuida de dados e pipelines",
            "AI_ENGINEER": "Cuida de IA, prompts e roteamento",
        }
        for name, role in agents.items():
            agent = db.query(models.Agent).filter(models.Agent.name == name).first()
            if not agent:
                db.add(models.Agent(name=name, role=role, status="IDLE"))

        prefs = {
            "COMMUNICATION": ["claude_subscription", "openai_subscription", "gemini_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "SUPPORT": ["claude_subscription", "openai_subscription", "gemini_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "COMMERCIAL": ["claude_subscription", "openai_subscription", "gemini_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "ANALYST": ["openai_subscription", "claude_subscription", "gemini_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "ARCHITECT": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "gemini_subscription", "ollama_local"],
            "DEVELOPER": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local", "gemini_subscription"],
            "QA": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "DEVOPS": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "gemini_subscription", "ollama_local"],
            "AI_ENGINEER": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "gemini_subscription", "ollama_local"],
            "DOCS": ["ollama_local", "kimi_k26_router", "deepseek_v4_router", "gemini_subscription", "openai_subscription", "claude_subscription"],
            "ORCHESTRATOR": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "gemini_subscription", "ollama_local"],
            "DESIGNER": ["claude_subscription", "gemini_subscription", "openai_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "SECURITY": ["openai_subscription", "claude_subscription", "deepseek_v4_router", "kimi_k26_router", "ollama_local"],
            "DATA_ENGINEER": ["openai_subscription", "deepseek_v4_router", "kimi_k26_router", "claude_subscription", "gemini_subscription", "ollama_local"],
        }
        existing = {(r.agent_key, r.provider_key) for r in db.query(models.AgentProviderPreference).all()}
        for agent_key, chain in prefs.items():
            for idx, provider_key in enumerate(chain, start=1):
                if (agent_key, provider_key) not in existing:
                    db.add(models.AgentProviderPreference(agent_key=agent_key, provider_key=provider_key, priority=idx))
        db.commit()
    finally:
        db.close()
