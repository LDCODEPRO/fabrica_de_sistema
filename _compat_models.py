"""
_compat_models.py — Modelos SQLAlchemy para a FORJA OS.
Compatível com nexus.db existente (não destrói dados).
"""
import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from _compat_db import Base

# =====================================================================
# TABELAS ORIGINAIS (Preservadas para retrocompatibilidade)
# =====================================================================

class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    evidences = relationship("Evidence", back_populates="mission", lazy="select")
    events = relationship("MissionEvent", back_populates="mission", lazy="select")


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


# =====================================================================
# NOVAS TABELAS: PRODUÇÃO BASE (Expansão Reality Engine)
# Exigência: id, created_at, updated_at, status, source, metadata_json
# =====================================================================

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    repository_url = Column(String, nullable=True)
    
    # Colunas Reality Engine
    status = Column(String, default="ACTIVE")
    source = Column(String, default="reality_engine")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class MissionEvent(Base):
    __tablename__ = "mission_events"
    
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    event_type = Column(String, index=True)
    payload = Column(Text, nullable=True)  # JSON string
    
    # Colunas Reality Engine
    status = Column(String, default="RECORDED")
    source = Column(String, default="mission_engine")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    mission = relationship("Mission", back_populates="events")


class Provider(Base):
    __tablename__ = "providers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    provider_type = Column(String) # LOCAL, SUBSCRIPTION, API
    is_active = Column(Boolean, default=True)


class ProviderHealthCheck(Base):
    __tablename__ = "provider_health_checks"
    
    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, index=True)
    latency_ms = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    checked_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Colunas Reality Engine
    status = Column(String, default="PENDING") # SUCCESS, FAILED, ENVIRONMENT_PENDING
    source = Column(String, default="provider_collector")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Artifact(Base):
    __tablename__ = "artifacts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String)
    artifact_type = Column(String)
    
    # Colunas Reality Engine
    status = Column(String, default="CREATED")
    source = Column(String, default="filesystem")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String) # INFO, WARNING, ERROR, CRITICAL
    message = Column(Text)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    
    # Colunas Reality Engine
    status = Column(String, default="ACTIVE")
    source = Column(String, default="alert_collector")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Deployment(Base):
    __tablename__ = "deployments"
    
    id = Column(Integer, primary_key=True, index=True)
    environment = Column(String) # STAGING, PRODUCTION
    version = Column(String)
    deployed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Colunas Reality Engine
    status = Column(String, default="PENDING") # PENDING, SUCCESS, FAILED
    source = Column(String, default="deployment_collector")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class GithubEvent(Base):
    __tablename__ = "github_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String) # push, pull_request
    repository = Column(String)
    payload = Column(Text) # JSON payload
    received_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Colunas Reality Engine
    status = Column(String, default="RECEIVED")
    source = Column(String, default="github_collector")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class SystemEvent(Base):
    __tablename__ = "system_events"
    
    id = Column(Integer, primary_key=True, index=True)
    component = Column(String, index=True)
    event_message = Column(Text)
    level = Column(String, default="INFO")
    
    # Colunas Reality Engine
    status = Column(String, default="LOGGED")
    source = Column(String, default="system")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Setting(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(Text)
    
    # Colunas Reality Engine
    status = Column(String, default="ACTIVE")
    source = Column(String, default="system")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
