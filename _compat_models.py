"""
_compat_models.py — Modelos SQLAlchemy para a FORJA OS.
Compatível com nexus.db existente (não destrói dados).
"""
import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from _compat_db import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    projects = relationship("Project", back_populates="client", lazy="select")
    connections = relationship("ClientConnection", back_populates="client", lazy="select")


class ClientConnection(Base):
    __tablename__ = "client_connections"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)  # 0/NULL = global (Fábrica)
    scope = Column(String, default="client")         # global (Fábrica, 1x) ou client (por cliente)
    kind = Column(String, nullable=False)            # instagram, canva, github, telegram, google_drive...
    label = Column(String, nullable=True)
    credential = Column(Text, nullable=True)         # token/segredo — NUNCA retornado pela API
    status = Column(String, default="PENDING")       # CONNECTED, PENDING, ERROR
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    client = relationship("Client", back_populates="connections")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE")
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    missions = relationship("Mission", back_populates="project", lazy="select")
    client = relationship("Client", back_populates="projects")


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    network = Column(String, default="instagram")    # instagram | facebook | ...
    tipo = Column(String, default="post")            # post | reel | story | carrossel
    briefing = Column(Text, nullable=True)           # o pedido/ideia
    output = Column(Text, nullable=True)             # conteúdo desenvolvido (legenda/roteiro/hashtags)
    media_url = Column(String, nullable=True)        # URL da imagem/vídeo
    status = Column(String, default="rascunho")      # rascunho | desenvolvido | aprovado | publicado
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ScheduledJob(Base):
    __tablename__ = "scheduled_jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    kind = Column(String, nullable=False)            # agent_act | telegram_message | run_queue
    spec = Column(Text, nullable=True)               # JSON com os parâmetros da ação
    schedule_type = Column(String, default="interval")  # interval | daily | once
    schedule_value = Column(String, nullable=True)   # minutos (interval) | HH:MM (daily) | ISO (once)
    next_run = Column(DateTime, nullable=True, index=True)
    last_run = Column(DateTime, nullable=True)
    last_result = Column(Text, nullable=True)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FinanceEntry(Base):
    __tablename__ = "finance_entries"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String, nullable=False)            # receita | despesa
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String, default="BRL")
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="PENDING")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    evidences = relationship("Evidence", back_populates="mission", lazy="select")
    project = relationship("Project", back_populates="missions")


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String, nullable=True)
    status = Column(String, default="IDLE")


class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=True)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    mission = relationship("Mission", back_populates="evidences")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class KnowledgeQuery(Base):
    __tablename__ = "knowledge_queries"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=True)
    response = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class LLMProvider(Base):
    __tablename__ = "llm_providers"

    id = Column(Integer, primary_key=True, index=True)
    provider_key = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    provider_type = Column(String, nullable=False)
    priority = Column(Integer, nullable=False)
    enabled = Column(Boolean, default=True)
    status = Column(String, default="ENVIRONMENT_PENDING")
    auth_mode = Column(String, nullable=False)
    cost_mode = Column(String, nullable=False)
    router_group = Column(String, nullable=True)
    last_health_check = Column(DateTime, nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ProviderHealthCheck(Base):
    __tablename__ = "provider_health_checks"

    id = Column(Integer, primary_key=True, index=True)
    provider_key = Column(String, index=True, nullable=False)
    status = Column(String, nullable=False)
    response_excerpt = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    checked_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentProviderPreference(Base):
    __tablename__ = "agent_provider_preferences"

    id = Column(Integer, primary_key=True, index=True)
    agent_key = Column(String, index=True, nullable=False)
    provider_key = Column(String, index=True, nullable=False)
    priority = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_key = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_key = Column(String, index=True, nullable=False)
    sender = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    provider_key = Column(String, nullable=True)
    provider_status = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentAction(Base):
    __tablename__ = "agent_actions"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, index=True, nullable=True)
    mission_id = Column(String, index=True, nullable=True)
    action_type = Column(String, index=True, nullable=False)
    tool_used = Column(String, index=True, nullable=False)
    target = Column(Text, nullable=True)
    result = Column(Text, nullable=True)
    status = Column(String, index=True, nullable=False)
    evidence_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class MissionEvent(Base):
    __tablename__ = "mission_events"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True, nullable=True)
    agent_id = Column(String, index=True, nullable=True)
    event_type = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
