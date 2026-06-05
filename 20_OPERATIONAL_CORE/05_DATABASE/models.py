from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="PENDING")  # PENDING, QUEUED, RUNNING, PAUSED, FAILED, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    evidences = relationship("Evidence", back_populates="mission")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role = Column(String)
    status = Column(String, default="IDLE")  # IDLE, WORKING, OFFLINE

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"))
    description = Column(Text)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    mission = relationship("Mission", back_populates="evidences")

class KnowledgeQuery(Base):
    __tablename__ = "knowledge_queries"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text)
    response = Column(Text)
    confidence = Column(Float)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MemoryEntry(Base):
    __tablename__ = "memory_entries"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    context = Column(String)
    data = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True)
    agent = Column(String, index=True)
    status = Column(String, default="RUNNING")
    mission = Column(Text)
    decision = Column(Text)
    result = Column(Text)
    confidence = Column(Float, default=0.0)
    llm_provider = Column(String)
    llm_model = Column(String)
    fallback_used = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    elapsed_ms = Column(Integer, default=0)


class AgentMemory(Base):
    __tablename__ = "agent_memories"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True)
    agent = Column(String, index=True)
    memory_type = Column(String, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentCost(Base):
    __tablename__ = "agent_costs"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True)
    agent = Column(String, index=True)
    provider = Column(String)
    model = Column(String)
    tokens = Column(Integer, default=0)
    estimated_cost = Column(Float, default=0.0)
    elapsed_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentHealth(Base):
    __tablename__ = "agent_health"

    id = Column(Integer, primary_key=True, index=True)
    agent = Column(String, unique=True, index=True)
    status = Column(String, default="AVAILABLE")
    active_executions = Column(Integer, default=0)
    average_elapsed_ms = Column(Float, default=0.0)
    failures = Column(Integer, default=0)
    retries = Column(Integer, default=0)
    fallbacks = Column(Integer, default=0)
    last_seen_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentFailure(Base):
    __tablename__ = "agent_failures"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True)
    agent = Column(String, index=True)
    error = Column(Text)
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AgentFallback(Base):
    __tablename__ = "agent_fallbacks"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, index=True)
    agent = Column(String, index=True)
    primary_llm = Column(String)
    fallback_llm = Column(String)
    provider_used = Column(String)
    reason = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
