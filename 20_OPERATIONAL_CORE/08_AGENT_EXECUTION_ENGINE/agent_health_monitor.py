from __future__ import annotations

from datetime import datetime
from sqlalchemy.orm import Session

models = __import__(
    "20_OPERATIONAL_CORE.05_DATABASE.models",
    fromlist=["AgentHealth", "AgentFailure", "AgentFallback"],
)
AgentHealth = models.AgentHealth
AgentFailure = models.AgentFailure
AgentFallback = models.AgentFallback


class AgentHealthMonitor:
    def __init__(self, db: Session):
        self.db = db

    def ensure_agent(self, agent: str) -> AgentHealth:
        row = self.db.query(AgentHealth).filter(AgentHealth.agent == agent).first()
        if not row:
            row = AgentHealth(agent=agent, status="AVAILABLE")
            self.db.add(row)
            self.db.commit()
            self.db.refresh(row)
        return row

    def mark_started(self, agent: str) -> None:
        row = self.ensure_agent(agent)
        row.status = "ACTIVE"
        row.active_executions += 1
        row.last_seen_at = datetime.utcnow()
        self.db.commit()

    def mark_completed(self, agent: str, elapsed_ms: int, fallback_used: bool = False) -> None:
        row = self.ensure_agent(agent)
        previous_count = max(0, row.active_executions)
        row.active_executions = max(0, row.active_executions - 1)
        row.status = "AVAILABLE" if row.active_executions == 0 else "ACTIVE"
        if row.average_elapsed_ms:
            row.average_elapsed_ms = round((row.average_elapsed_ms + elapsed_ms) / 2, 2)
        else:
            row.average_elapsed_ms = float(elapsed_ms)
        if previous_count == 0:
            row.active_executions = 0
        if fallback_used:
            row.fallbacks += 1
        row.last_seen_at = datetime.utcnow()
        self.db.commit()

    def mark_failed(self, mission_id: str, agent: str, error: str, retry_count: int = 0) -> AgentFailure:
        row = self.ensure_agent(agent)
        row.status = "UNAVAILABLE"
        row.active_executions = max(0, row.active_executions - 1)
        row.failures += 1
        row.retries += retry_count
        row.last_seen_at = datetime.utcnow()
        failure = AgentFailure(
            mission_id=str(mission_id),
            agent=agent,
            error=error,
            retry_count=retry_count,
        )
        self.db.add(failure)
        self.db.commit()
        self.db.refresh(failure)
        return failure

    def record_fallback(
        self,
        mission_id: str,
        agent: str,
        primary_llm: str,
        fallback_llm: str,
        provider_used: str,
        reason: str,
    ) -> AgentFallback:
        row = self.ensure_agent(agent)
        row.fallbacks += 1
        fallback = AgentFallback(
            mission_id=str(mission_id),
            agent=agent,
            primary_llm=primary_llm,
            fallback_llm=fallback_llm,
            provider_used=provider_used,
            reason=reason,
        )
        self.db.add(fallback)
        self.db.commit()
        self.db.refresh(fallback)
        return fallback

    def snapshot(self) -> dict:
        rows = self.db.query(AgentHealth).all()
        return {
            "active_agents": [r.agent for r in rows if r.status == "ACTIVE"],
            "unavailable_agents": [r.agent for r in rows if r.status == "UNAVAILABLE"],
            "average_elapsed_ms": {
                r.agent: r.average_elapsed_ms for r in rows
            },
            "failures": {r.agent: r.failures for r in rows},
            "retries": {r.agent: r.retries for r in rows},
            "fallbacks": {r.agent: r.fallbacks for r in rows},
        }
