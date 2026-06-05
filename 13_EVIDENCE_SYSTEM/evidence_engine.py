"""
evidence_engine.py
------------------
Orchestrator for recording, storing, and querying decision evidence records.

This module ties together decision_logger, source_tracker, and
confidence_calculator into a single public interface used by Fabrica de
Sistemas agents.

Quick start:
    from evidence_engine import EvidenceEngine

    engine = EvidenceEngine()

    record = engine.record_decision(
        decision="Use PostgreSQL as the primary relational database",
        evidence=(
            "PostgreSQL provides ACID guarantees, native JSON support, "
            "mature tooling, and a large community. It outperformed MySQL "
            "and SQLite in our read/write benchmark for the expected load."
        ),
        source="PostgreSQL Documentation 16",
        author="ARCHITECT",
        work="MISSION-007 / database selection",
        confidence=0.88,
        mission_id="MISSION-007",
    )
    print(record["decision_id"])
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Sequence

from decision_logger import DecisionLogger
from source_tracker import SourceTracker
from confidence_calculator import ConfidenceCalculator


class EvidenceEngine:
    """High-level interface for the evidence system.

    Args:
        base_dir: Root directory for this engine.  A ``records/`` subfolder
                  is created automatically.  Defaults to the directory that
                  contains this module.
    """

    def __init__(self, base_dir: str | Path | None = None) -> None:
        if base_dir is None:
            base_dir = Path(__file__).parent
        self._base_dir = Path(base_dir)
        self._records_dir = self._base_dir / "records"

        self._logger = DecisionLogger(self._records_dir)
        self._tracker = SourceTracker(self._records_dir)
        self._calculator = ConfidenceCalculator()

    # ------------------------------------------------------------------
    # Primary API
    # ------------------------------------------------------------------

    def record_decision(
        self,
        decision: str,
        evidence: str,
        source: str,
        author: str,
        work: str,
        confidence: float,
        mission_id: str,
        tags: list[str] | None = None,
        related_decisions: list[str] | None = None,
    ) -> dict:
        """Create and persist a new evidence record.

        Args:
            decision:    Concise statement of the decision made.
            evidence:    Reasoning or supporting evidence for the decision.
            source:      Primary source consulted (book, article, framework…).
            author:      Agent or human that is recording the decision.
            work:        Work item / module / task context.
            confidence:  Confidence score in [0.0, 1.0].  Pass the result of
                         ConfidenceCalculator.calculate() or a direct estimate.
            mission_id:  Mission this decision belongs to.
            tags:        Optional list of free-form category tags.
            related_decisions: Optional list of decision_ids that relate to
                               or supersede this one.

        Returns:
            The full record dict (also persisted to disk).

        Raises:
            ValueError: If required fields are blank or confidence is outside
                        the valid range.
        """
        self._validate_inputs(decision, evidence, source, author, work, confidence, mission_id)

        timestamp = datetime.now(tz=timezone.utc).isoformat()
        decision_id = self._generate_id(timestamp, decision, author)

        record: dict = {
            "decision_id": decision_id,
            "mission_id": mission_id,
            "decision": decision.strip(),
            "evidence": evidence.strip(),
            "source": source.strip(),
            "author": author.strip(),
            "work": work.strip(),
            "confidence": round(float(confidence), 4),
            "timestamp": timestamp,
        }

        if tags:
            record["tags"] = sorted(set(tags))
        if related_decisions:
            record["related_decisions"] = related_decisions

        saved_path = self._logger.write(record)
        # Update the in-memory source tracker with the new record
        self._tracker.load_record(record)

        record["_saved_to"] = str(saved_path)
        return record

    # ------------------------------------------------------------------
    # Convenience wrappers
    # ------------------------------------------------------------------

    def calculate_confidence(
        self,
        sources: Sequence[str],
        source_types: Sequence[str] | None = None,
        agreeing_agents: Sequence[str] | None = None,
    ) -> float:
        """Delegate to ConfidenceCalculator and return a score."""
        return self._calculator.calculate(
            sources=sources,
            source_types=source_types,
            agreeing_agents=agreeing_agents,
        )

    def get_decision(self, decision_id: str) -> dict:
        """Retrieve a single evidence record by its decision_id."""
        return self._logger.read(decision_id)

    def list_decisions(
        self,
        mission_id: str | None = None,
        agent: str | None = None,
    ) -> list[dict]:
        """Return stored records, optionally filtered by mission or agent.

        If both filters are provided, only records matching BOTH are returned.
        """
        if mission_id and agent:
            by_mission = set(
                r["decision_id"] for r in self._logger.filter_by_mission(mission_id)
            )
            return [
                r for r in self._logger.filter_by_agent(agent)
                if r["decision_id"] in by_mission
            ]
        if mission_id:
            return self._logger.filter_by_mission(mission_id)
        if agent:
            return self._logger.filter_by_agent(agent)
        return self._logger.list_all()

    def top_sources(self, n: int = 10, reload: bool = True) -> list[tuple[str, int]]:
        """Return the N most referenced sources across all stored records.

        Args:
            n:      How many top sources to return.
            reload: If True, reload all records from disk before computing
                    (picks up any records written by external processes).
        """
        if reload:
            self._tracker.load_all()
        return self._tracker.top_sources(n)

    def source_summary(self, top_n: int = 10) -> str:
        """Return a human-readable source usage summary."""
        self._tracker.load_all()
        return self._tracker.summary(top_n)

    def record_count(self) -> int:
        """Return the total number of persisted evidence records."""
        return self._logger.count()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _generate_id(timestamp: str, decision: str, author: str) -> str:
        """Generate a unique decision_id: <compact_timestamp>-<8-char hash>.

        Format: YYYYMMDDTHHmmss-<sha256[:8]>
        """
        compact_ts = (
            timestamp[:19]
            .replace("-", "")
            .replace(":", "")
            .replace("T", "T")
        )
        payload = f"{timestamp}{decision}{author}"
        short_hash = hashlib.sha256(payload.encode()).hexdigest()[:8]
        return f"{compact_ts}-{short_hash}"

    @staticmethod
    def _validate_inputs(
        decision: str,
        evidence: str,
        source: str,
        author: str,
        work: str,
        confidence: float,
        mission_id: str,
    ) -> None:
        errors: list[str] = []

        if not decision or not decision.strip():
            errors.append("'decision' must not be empty")
        if not evidence or len(evidence.strip()) < 10:
            errors.append("'evidence' must be at least 10 characters")
        if not source or not source.strip():
            errors.append("'source' must not be empty")
        if not author or not author.strip():
            errors.append("'author' must not be empty")
        if not work or not work.strip():
            errors.append("'work' must not be empty")
        if not mission_id or not mission_id.strip():
            errors.append("'mission_id' must not be empty")
        if not (0.0 <= float(confidence) <= 1.0):
            errors.append(f"'confidence' must be between 0.0 and 1.0, got {confidence}")

        if errors:
            raise ValueError("record_decision validation failed:\n  " + "\n  ".join(errors))


# ---------------------------------------------------------------------------
# CLI smoke-test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    engine = EvidenceEngine()

    print(f"Existing records: {engine.record_count()}")

    # Calculate confidence before recording
    conf = engine.calculate_confidence(
        sources=["Clean Architecture", "Domain-Driven Design"],
        source_types=["book", "book"],
        agreeing_agents=["ARCHITECT", "DEVELOPER"],
    )
    print(f"Calculated confidence: {conf}  ({ConfidenceCalculator.classify(conf)})")

    record = engine.record_decision(
        decision="Adopt hexagonal architecture for all new microservices",
        evidence=(
            "Hexagonal architecture (ports & adapters) decouples business logic "
            "from infrastructure concerns. This enables independent testing of the "
            "domain layer, simplifies replacing frameworks, and aligns with Clean "
            "Architecture principles described by Robert C. Martin."
        ),
        source="Clean Architecture",
        author="ARCHITECT",
        work="MISSION-001 / architectural guidelines",
        confidence=conf,
        mission_id="MISSION-001",
        tags=["architecture", "microservices"],
    )

    print(f"\nRecorded decision_id: {record['decision_id']}")
    print(f"Saved to:            {record['_saved_to']}")
    print(f"\n{engine.source_summary(top_n=5)}")
