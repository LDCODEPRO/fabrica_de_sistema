"""
knowledge_ranker.py
Fabrica de Sistemas - Knowledge Engine
Ranks search hits by relevance, source authority, and topic adherence.
"""

from __future__ import annotations

from dataclasses import dataclass
from knowledge_search import SearchHit

# Authority weights: files closest to primary knowledge get higher weight
FILE_AUTHORITY: dict[str, float] = {
    "SOURCE_INDEX.md":         1.0,
    "MASTERS_AND_REFERENCES.md": 0.95,
    "BOOKS_AND_WORKS.md":      0.90,
    "FRAMEWORKS_AND_METHODS.md": 0.85,
    "APPLIED_PATTERNS.md":     0.80,
    "TOOLS_AND_STANDARDS.md":  0.75,
    "BEST_PRACTICES.md":       0.70,
    "LEARNING_NOTES.md":       0.60,
}

# Lines with these markdown markers carry more weight
RELEVANCE_MARKERS = ["##", "###", "**", "- **", "| "]


@dataclass
class RankedHit:
    hit: SearchHit
    relevance_score: float
    authority_score: float
    final_score: float


def _relevance(line: str) -> float:
    """Score 0.0–1.0 based on line markers."""
    for marker in RELEVANCE_MARKERS:
        if line.startswith(marker):
            return 1.0
    if line.startswith("-") or line.startswith("*"):
        return 0.7
    return 0.4


def rank(hits: list[SearchHit], top_n: int = 10) -> list[RankedHit]:
    """
    Rank a list of SearchHit objects.
    Returns top_n ranked results sorted by final_score descending.
    """
    ranked: list[RankedHit] = []
    for hit in hits:
        authority  = FILE_AUTHORITY.get(hit.file, 0.5)
        relevance  = _relevance(hit.line)
        final      = round((authority * 0.6) + (relevance * 0.4), 4)
        ranked.append(RankedHit(
            hit=hit,
            relevance_score=relevance,
            authority_score=authority,
            final_score=final,
        ))
    ranked.sort(key=lambda r: r.final_score, reverse=True)
    return ranked[:top_n]
