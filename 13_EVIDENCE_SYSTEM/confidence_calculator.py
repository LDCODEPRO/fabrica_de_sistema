"""
confidence_calculator.py
------------------------
Calculates a composite confidence score (0.0–1.0) for a decision evidence record.

Three factors are weighted and combined:
  1. Source count   — more distinct sources raises confidence.
  2. Source authority — books carry more weight than articles, which outweigh raw notes.
  3. Cross-agent validation — the same conclusion reached by multiple agents boosts confidence.

Usage:
    from confidence_calculator import ConfidenceCalculator

    calc = ConfidenceCalculator()
    score = calc.calculate(
        sources=["Clean Code", "Pragmatic Programmer"],
        source_types=["book", "book"],
        agreeing_agents=["ARCHITECT", "DEVELOPER"],
    )
    # score -> float between 0.0 and 1.0
"""

from __future__ import annotations

import math
from typing import Literal, Sequence

# ---------------------------------------------------------------------------
# Authority tiers
# ---------------------------------------------------------------------------
# Each tier maps a source type label to a base authority weight.
# Values are normalised internally so the exact numbers only matter relatively.
AUTHORITY_WEIGHTS: dict[str, float] = {
    "book": 1.0,
    "standard": 0.95,
    "whitepaper": 0.85,
    "article": 0.70,
    "blog": 0.55,
    "documentation": 0.65,
    "internal": 0.50,
    "note": 0.35,
    "unknown": 0.20,
}

# Weight given to each contributing factor in the final score
FACTOR_WEIGHTS = {
    "source_count": 0.30,
    "source_authority": 0.45,
    "cross_agent": 0.25,
}

SourceType = Literal[
    "book", "standard", "whitepaper", "article", "blog",
    "documentation", "internal", "note", "unknown"
]


class ConfidenceCalculator:
    """Calculates a confidence score for a decision record.

    All parameters accept sequences so a single call can pass multiple
    sources or agents at once.
    """

    # Maximum number of sources / agents beyond which the score saturates.
    MAX_SOURCES = 5
    MAX_AGENTS = 4

    def calculate(
        self,
        sources: Sequence[str],
        source_types: Sequence[str] | None = None,
        agreeing_agents: Sequence[str] | None = None,
    ) -> float:
        """Return a composite confidence score in [0.0, 1.0].

        Args:
            sources: List of source names (books, articles, etc.).  At least
                one source is required; pass an empty list to get 0.0.
            source_types: Parallel list of type labels for each source.
                Defaults to "unknown" for any missing entry.
            agreeing_agents: List of distinct agent names that reached the
                same conclusion.  Defaults to a single anonymous agent.

        Returns:
            Float confidence score rounded to 4 decimal places.
        """
        if not sources:
            return 0.0

        source_types = list(source_types or [])
        agreeing_agents = list(agreeing_agents or ["unknown"])

        # Pad or truncate source_types to match sources length
        padded_types = (source_types + ["unknown"] * len(sources))[: len(sources)]

        score_count = self._source_count_score(sources)
        score_authority = self._source_authority_score(padded_types)
        score_agents = self._cross_agent_score(agreeing_agents)

        composite = (
            FACTOR_WEIGHTS["source_count"] * score_count
            + FACTOR_WEIGHTS["source_authority"] * score_authority
            + FACTOR_WEIGHTS["cross_agent"] * score_agents
        )

        return round(min(max(composite, 0.0), 1.0), 4)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _source_count_score(self, sources: Sequence[str]) -> float:
        """Logarithmic curve: 1 source → ~0.20, MAX_SOURCES → 1.0."""
        unique = len(set(sources))
        if unique == 0:
            return 0.0
        # log scale so each additional source matters less than the first
        raw = math.log(unique + 1) / math.log(self.MAX_SOURCES + 1)
        return min(raw, 1.0)

    def _source_authority_score(self, source_types: Sequence[str]) -> float:
        """Average authority weight across all sources, normalised to [0, 1]."""
        if not source_types:
            return 0.0
        weights = [
            AUTHORITY_WEIGHTS.get(t.lower(), AUTHORITY_WEIGHTS["unknown"])
            for t in source_types
        ]
        return sum(weights) / len(weights)

    def _cross_agent_score(self, agreeing_agents: Sequence[str]) -> float:
        """Logarithmic curve: 1 agent → ~0.50, MAX_AGENTS → 1.0."""
        unique = len(set(agreeing_agents))
        if unique == 0:
            return 0.0
        raw = math.log(unique + 1) / math.log(self.MAX_AGENTS + 1)
        return min(raw, 1.0)

    # ------------------------------------------------------------------
    # Convenience: classify a raw score into a human-readable label
    # ------------------------------------------------------------------

    @staticmethod
    def classify(score: float) -> str:
        """Return a human-readable label for a confidence score.

        Thresholds:
            0.0 – 0.39  -> LOW
            0.40 – 0.64 -> MEDIUM
            0.65 – 0.84 -> HIGH
            0.85 – 1.0  -> VERY_HIGH
        """
        if score < 0.40:
            return "LOW"
        if score < 0.65:
            return "MEDIUM"
        if score < 0.85:
            return "HIGH"
        return "VERY_HIGH"


# ---------------------------------------------------------------------------
# CLI smoke-test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    calc = ConfidenceCalculator()

    examples = [
        {
            "label": "Single note (weak)",
            "sources": ["personal notes"],
            "source_types": ["note"],
            "agreeing_agents": ["DEVELOPER"],
        },
        {
            "label": "Two books, two agents",
            "sources": ["Clean Code", "Pragmatic Programmer"],
            "source_types": ["book", "book"],
            "agreeing_agents": ["ARCHITECT", "DEVELOPER"],
        },
        {
            "label": "Four diverse sources, three agents",
            "sources": ["Design Patterns", "OWASP Guide", "RFC 9110", "Internal Wiki"],
            "source_types": ["book", "standard", "standard", "internal"],
            "agreeing_agents": ["ARCHITECT", "SECURITY", "QA"],
        },
    ]

    for ex in examples:
        score = calc.calculate(
            sources=ex["sources"],
            source_types=ex["source_types"],
            agreeing_agents=ex["agreeing_agents"],
        )
        label = ConfidenceCalculator.classify(score)
        print(f"[{label:9s}] {score:.4f}  — {ex['label']}")
