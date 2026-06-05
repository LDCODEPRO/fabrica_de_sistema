from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

from .agent_context import AgentProfile


ROOT = Path(__file__).resolve().parents[2]
LLM_ROUTER_DIR = ROOT / "17_AUTOMACOES" / "LLM_ROUTER"
if str(LLM_ROUTER_DIR) not in sys.path:
    sys.path.insert(0, str(LLM_ROUTER_DIR))

from llm_router import LLMRouter  # noqa: E402


TASK_TYPE_BY_AGENT = {
    "ARCHITECT": "architecture",
    "DEVELOPER": "coding",
    "QA": "audit",
    "DOCS": "documentation",
    "ANALYST": "research",
    "ORCHESTRATOR": "simple",
    "DESIGNER": "multimodal",
    "SECURITY": "audit",
    "DEVOPS": "coding",
    "DATA_ENGINEER": "coding",
    "AI_ENGINEER": "coding",
}


class AgentLLMBridge:
    """Single legal path from Agent to LLM Router to Provider Registry to Provider."""

    def route(self, mission_id: str, profile: AgentProfile, prompt: str, estimated_tokens: int) -> dict[str, Any]:
        task_type = TASK_TYPE_BY_AGENT.get(profile.name, "simple")
        router = LLMRouter(str(mission_id))
        result = router.route(
            task_type=task_type,
            prompt=prompt,
            estimated_tokens=estimated_tokens,
            require_vision=profile.name == "DESIGNER",
            force_local=profile.primary_llm in {"gemma4", "ollama"} and profile.fallback_llm in {"gemma4", "ollama"},
        )
        return {
            "success": result.success,
            "provider": result.provider_id,
            "model": result.model,
            "response": result.response,
            "fallback_used": result.fallback_used,
            "reason": result.reason,
            "timestamp": result.timestamp,
            "task_type": task_type,
            "audit": result.to_audit_entry(),
            "registry": router.registry,
        }
