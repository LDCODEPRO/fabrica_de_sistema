from __future__ import annotations

import json
from sqlalchemy.orm import Session

models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["AgentMemory"])
AgentMemory = models.AgentMemory


class AgentMemoryBridge:
    def __init__(self, db: Session):
        self.db = db

    def record(self, mission_id: str, agent: str, memory_type: str, content: str | dict) -> AgentMemory:
        payload = json.dumps(content, ensure_ascii=False) if isinstance(content, dict) else str(content)
        memory = AgentMemory(
            mission_id=str(mission_id),
            agent=agent,
            memory_type=memory_type,
            content=payload,
        )
        self.db.add(memory)
        self.db.commit()
        self.db.refresh(memory)
        return memory

    def record_execution_cycle(
        self,
        mission_id: str,
        agent: str,
        mission: str,
        decision: str,
        result: str,
        error: str | None = None,
    ) -> None:
        self.record(mission_id, agent, "MISSION", mission)
        self.record(mission_id, agent, "DECISION", decision)
        if error:
            self.record(mission_id, agent, "ERROR", error)
        self.record(mission_id, agent, "LEARNING", f"Execution completed with decision: {decision}")
        self.record(mission_id, agent, "RESULT", result)

    def list_for_mission(self, mission_id: str) -> list[AgentMemory]:
        return self.db.query(AgentMemory).filter(AgentMemory.mission_id == str(mission_id)).all()
