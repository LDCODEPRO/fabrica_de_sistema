"""
source_tracker.py
-----------------
Tracks which sources (books, authors, frameworks, articles) were referenced
across evidence records stored in the records/ directory.

Builds a usage-frequency map from persisted JSON records and exposes helpers
to query the most-referenced sources globally or per mission.

Usage:
    from source_tracker import SourceTracker

    tracker = SourceTracker(records_dir="records")
    tracker.load_all()

    # Top-5 most referenced sources across all missions
    top = tracker.top_sources(n=5)

    # Frequency map for a specific mission
    freq = tracker.frequency_for_mission("MISSION-001")
"""

from __future__ import annotations

import json
import os
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterator


class SourceTracker:
    """Scans evidence records and builds source-usage statistics.

    Args:
        records_dir: Path to the directory containing JSON evidence records.
                     Defaults to ``records/`` relative to this file.
    """

    def __init__(self, records_dir: str | Path | None = None) -> None:
        if records_dir is None:
            records_dir = Path(__file__).parent / "records"
        self._records_dir = Path(records_dir)

        # Global source counter: source_name -> total usage count
        self._global_counter: Counter[str] = Counter()

        # Per-mission counters: mission_id -> Counter[source_name]
        self._mission_counters: defaultdict[str, Counter[str]] = defaultdict(Counter)

        # Per-agent counters: agent_name -> Counter[source_name]
        self._agent_counters: defaultdict[str, Counter[str]] = defaultdict(Counter)

        # Track how many records were loaded
        self._loaded_count: int = 0

    # ------------------------------------------------------------------
    # Loading
    # ------------------------------------------------------------------

    def load_all(self) -> int:
        """Load (or reload) all JSON records from the records directory.

        Returns:
            Number of records successfully loaded.
        """
        self._global_counter.clear()
        self._mission_counters.clear()
        self._agent_counters.clear()
        self._loaded_count = 0

        if not self._records_dir.exists():
            return 0

        for record in self._iter_records():
            self._index_record(record)
            self._loaded_count += 1

        return self._loaded_count

    def load_record(self, record: dict) -> None:
        """Index a single in-memory record (useful when records are created
        in the same process without flushing to disk yet)."""
        self._index_record(record)
        self._loaded_count += 1

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def top_sources(self, n: int = 10) -> list[tuple[str, int]]:
        """Return the top-N most referenced sources across all records.

        Returns:
            List of (source_name, count) tuples, sorted descending by count.
        """
        return self._global_counter.most_common(n)

    def top_sources_for_mission(self, mission_id: str, n: int = 10) -> list[tuple[str, int]]:
        """Return the top-N most referenced sources for a specific mission."""
        return self._mission_counters[mission_id].most_common(n)

    def top_sources_for_agent(self, agent: str, n: int = 10) -> list[tuple[str, int]]:
        """Return the top-N most referenced sources for a specific agent."""
        return self._agent_counters[agent].most_common(n)

    def frequency_for_mission(self, mission_id: str) -> dict[str, int]:
        """Return the full source-frequency map for a mission as a plain dict."""
        return dict(self._mission_counters[mission_id])

    def all_sources(self) -> list[str]:
        """Return a sorted list of every unique source name seen."""
        return sorted(self._global_counter.keys())

    def source_count(self, source: str) -> int:
        """Return total usage count for a specific source name."""
        return self._global_counter.get(source, 0)

    @property
    def loaded_count(self) -> int:
        """Number of records currently indexed."""
        return self._loaded_count

    # ------------------------------------------------------------------
    # Reporting
    # ------------------------------------------------------------------

    def summary(self, top_n: int = 10) -> str:
        """Return a human-readable summary of the top sources."""
        lines = [
            f"Source Tracker — {self._loaded_count} records indexed",
            f"Unique sources: {len(self._global_counter)}",
            "",
            f"Top {top_n} sources:",
        ]
        for rank, (src, count) in enumerate(self.top_sources(top_n), start=1):
            lines.append(f"  {rank:2d}. {src}  ({count} reference{'s' if count != 1 else ''})")
        return "\n".join(lines)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _iter_records(self) -> Iterator[dict]:
        for path in sorted(self._records_dir.glob("*.json")):
            try:
                with path.open("r", encoding="utf-8") as fh:
                    data = json.load(fh)
                if isinstance(data, dict):
                    yield data
            except (json.JSONDecodeError, OSError):
                # Skip malformed or unreadable files silently
                continue

    def _index_record(self, record: dict) -> None:
        source = record.get("source", "").strip()
        if not source:
            return

        mission_id = record.get("mission_id", "UNKNOWN")
        author = record.get("author", "UNKNOWN")

        self._global_counter[source] += 1
        self._mission_counters[mission_id][source] += 1
        self._agent_counters[author][source] += 1


# ---------------------------------------------------------------------------
# CLI smoke-test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    records_dir = sys.argv[1] if len(sys.argv) > 1 else None
    tracker = SourceTracker(records_dir)
    count = tracker.load_all()
    print(tracker.summary())
    print(f"\nTotal records loaded: {count}")
