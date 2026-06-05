from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["Evidence"])
Evidence = models.Evidence

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE_DIR = ROOT / "13_EVIDENCE_SYSTEM"
if str(EVIDENCE_DIR) not in sys.path:
    sys.path.insert(0, str(EVIDENCE_DIR))

from evidence_engine import EvidenceEngine  # noqa: E402


class AgentEvidenceBridge:
    def __init__(self, db: Session):
        self.db = db
        self.engine = EvidenceEngine(EVIDENCE_DIR)

    def record(
        self,
        mission_id: str,
        agent: str,
        decision: str,
        evidence: str,
        confidence: float,
    ) -> dict[str, Any]:
        record = self.engine.record_decision(
            decision=decision,
            evidence=evidence,
            source="Agent Execution Engine / Knowledge Engine",
            author=agent,
            work="AGENT_EXECUTION_ENGINE_V1",
            confidence=confidence,
            mission_id=str(mission_id),
            tags=["agent_execution", agent.lower()],
        )
        db_record = Evidence(
            mission_id=int(mission_id) if str(mission_id).isdigit() else None,
            description=(
                f"mission_id={mission_id}; agent={agent}; decision={decision}; "
                f"confidence={confidence}; evidence={evidence[:500]}"
            ),
            file_path=record.get("_saved_to"),
        )
        self.db.add(db_record)
        self.db.commit()
        record["database_evidence_id"] = db_record.id
        return {
            "mission_id": str(mission_id),
            "agent": agent,
            "decision": decision,
            "evidence": evidence,
            "confidence": confidence,
            "timestamp": record["timestamp"],
            "decision_id": record["decision_id"],
            "saved_to": record.get("_saved_to"),
        }
