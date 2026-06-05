"""
decision_logger.py
------------------
Writes evidence records to disk as JSON files and provides read/filter helpers.

Records are saved to a configurable directory (default: records/ next to this
file).  Each file is named after its decision_id so filenames are unique and
sortable by creation time.

Usage:
    from decision_logger import DecisionLogger

    logger = DecisionLogger()

    # Write a record
    logger.write(record_dict)

    # Read one back
    rec = logger.read("20260605T142300-a3f9b1c2")

    # List all records
    all_records = logger.list_all()

    # Filter
    mission_records = logger.filter_by_mission("MISSION-001")
    agent_records   = logger.filter_by_agent("ARCHITECT")
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Callable, Iterator


class DecisionLogger:
    """Persists and retrieves evidence records as JSON files.

    Args:
        records_dir: Directory where JSON files are stored.
                     Created automatically if it does not exist.
                     Defaults to ``records/`` next to this module.
    """

    def __init__(self, records_dir: str | Path | None = None) -> None:
        if records_dir is None:
            records_dir = Path(__file__).parent / "records"
        self._records_dir = Path(records_dir)
        self._records_dir.mkdir(parents=True, exist_ok=True)

    # ------------------------------------------------------------------
    # Write
    # ------------------------------------------------------------------

    def write(self, record: dict) -> Path:
        """Persist a record dictionary to disk.

        The file name is derived from the record's ``decision_id`` field.
        If the field is absent a ``ValueError`` is raised.

        Args:
            record: A dict that conforms to evidence_schema.json.

        Returns:
            Path to the written file.
        """
        decision_id = record.get("decision_id")
        if not decision_id:
            raise ValueError("record must contain a non-empty 'decision_id' field")

        path = self._path_for(decision_id)
        with path.open("w", encoding="utf-8") as fh:
            json.dump(record, fh, ensure_ascii=False, indent=2)
        return path

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    def read(self, decision_id: str) -> dict:
        """Load a single record by its decision_id.

        Raises:
            FileNotFoundError: If no record with that id exists.
        """
        path = self._path_for(decision_id)
        if not path.exists():
            raise FileNotFoundError(
                f"No evidence record found for decision_id '{decision_id}' "
                f"in {self._records_dir}"
            )
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)

    def exists(self, decision_id: str) -> bool:
        """Return True if a record file exists for the given decision_id."""
        return self._path_for(decision_id).exists()

    # ------------------------------------------------------------------
    # List & filter
    # ------------------------------------------------------------------

    def list_all(self) -> list[dict]:
        """Return all records sorted by timestamp (ascending).

        Records with missing or unparsable timestamps are sorted last.
        """
        records = list(self._iter_all())
        records.sort(key=lambda r: r.get("timestamp", ""))
        return records

    def list_ids(self) -> list[str]:
        """Return all decision_ids (filenames without extension), sorted."""
        return sorted(p.stem for p in self._records_dir.glob("*.json"))

    def filter_by_mission(self, mission_id: str) -> list[dict]:
        """Return all records for a specific mission_id."""
        return self._filter(lambda r: r.get("mission_id") == mission_id)

    def filter_by_agent(self, agent: str) -> list[dict]:
        """Return all records whose author matches agent (case-insensitive)."""
        agent_lower = agent.lower()
        return self._filter(lambda r: r.get("author", "").lower() == agent_lower)

    def filter_by_confidence(self, min_confidence: float = 0.0, max_confidence: float = 1.0) -> list[dict]:
        """Return records with confidence within [min_confidence, max_confidence]."""
        return self._filter(
            lambda r: min_confidence <= r.get("confidence", 0.0) <= max_confidence
        )

    def count(self) -> int:
        """Return the total number of stored records."""
        return sum(1 for _ in self._records_dir.glob("*.json"))

    # ------------------------------------------------------------------
    # Delete
    # ------------------------------------------------------------------

    def delete(self, decision_id: str) -> bool:
        """Remove a record file.  Returns True if deleted, False if not found."""
        path = self._path_for(decision_id)
        if path.exists():
            path.unlink()
            return True
        return False

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _path_for(self, decision_id: str) -> Path:
        # Sanitise decision_id so it is safe as a filename
        safe_id = decision_id.replace("/", "_").replace("\\", "_")
        return self._records_dir / f"{safe_id}.json"

    def _iter_all(self) -> Iterator[dict]:
        for path in self._records_dir.glob("*.json"):
            try:
                with path.open("r", encoding="utf-8") as fh:
                    data = json.load(fh)
                if isinstance(data, dict):
                    yield data
            except (json.JSONDecodeError, OSError):
                continue

    def _filter(self, predicate: Callable[[dict], bool]) -> list[dict]:
        return [r for r in self._iter_all() if predicate(r)]


# ---------------------------------------------------------------------------
# CLI smoke-test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    records_dir = sys.argv[1] if len(sys.argv) > 1 else None
    logger = DecisionLogger(records_dir)

    total = logger.count()
    print(f"Records in {logger._records_dir}: {total}")

    if total:
        print("\nAll decision IDs:")
        for did in logger.list_ids():
            print(f"  {did}")
