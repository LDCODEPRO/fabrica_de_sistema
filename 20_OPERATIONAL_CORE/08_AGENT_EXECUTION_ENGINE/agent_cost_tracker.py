from __future__ import annotations

from sqlalchemy.orm import Session

models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["AgentCost"])
AgentCost = models.AgentCost


class AgentCostTracker:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def estimate_tokens(prompt: str, response: str | None = None) -> int:
        text = f"{prompt or ''} {response or ''}".strip()
        return max(1, int(len(text.split()) * 1.35))

    @staticmethod
    def estimate_cost(provider_registry: dict, provider: str, tokens: int) -> float:
        config = provider_registry.get("providers", {}).get(provider, {})
        if config.get("local", False):
            return 0.0
        rate = config.get("cost_per_1k_input", 0.0) + config.get("cost_per_1k_output", 0.0)
        return round((tokens / 1000) * rate, 8)

    def record(
        self,
        mission_id: str,
        agent: str,
        provider: str,
        model: str,
        tokens: int,
        estimated_cost: float,
        elapsed_ms: int,
    ) -> AgentCost:
        cost = AgentCost(
            mission_id=str(mission_id),
            agent=agent,
            provider=provider,
            model=model,
            tokens=tokens,
            estimated_cost=estimated_cost,
            elapsed_ms=elapsed_ms,
        )
        self.db.add(cost)
        self.db.commit()
        self.db.refresh(cost)
        return cost
