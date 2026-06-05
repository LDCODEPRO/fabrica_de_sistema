from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class AgentProfile:
    name: str
    role: str
    primary_llm: str
    fallback_llm: str
    knowledge_domain: list[str]
    memory_enabled: bool = True
    evidence_enabled: bool = True

    def as_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "role": self.role,
            "primary_llm": self.primary_llm,
            "fallback_llm": self.fallback_llm,
            "knowledge_domain": list(self.knowledge_domain),
            "memory_enabled": self.memory_enabled,
            "evidence_enabled": self.evidence_enabled,
        }


@dataclass
class AgentMissionContext:
    mission_id: str
    mission: str
    profile: AgentProfile
    created_at: datetime = field(default_factory=datetime.utcnow)
    knowledge: list[dict[str, Any]] = field(default_factory=list)
    llm_result: dict[str, Any] | None = None
    decision: str = ""
    confidence: float = 0.0

    @property
    def agent(self) -> str:
        return self.profile.name

    def build_prompt(self) -> str:
        evidence_lines = []
        for item in self.knowledge[:8]:
            evidence_lines.append(
                f"- {item['agent']}/{item['file']}:{item['line_number']} "
                f"(score={item['score']}): {item['line']}"
            )
        evidence = "\n".join(evidence_lines) if evidence_lines else "- No ranked knowledge found."
        return (
            f"Agent: {self.profile.name}\n"
            f"Role: {self.profile.role}\n"
            f"Knowledge domains: {', '.join(self.profile.knowledge_domain)}\n"
            f"Mission ID: {self.mission_id}\n"
            f"Mission:\n{self.mission}\n\n"
            f"Ranked knowledge evidence:\n{evidence}\n\n"
            "Return a concise production-ready execution result with decision, "
            "evidence used, risks, and next action."
        )
