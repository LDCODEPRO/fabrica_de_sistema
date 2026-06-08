"""
_compat_models.py — Modelos SQLAlchemy para a FORJA OS.
Compatível com nexus.db existente (não destrói dados).
"""
import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from _compat_db import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    evidences = relationship("Evidence", back_populates="mission", lazy="select")


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
