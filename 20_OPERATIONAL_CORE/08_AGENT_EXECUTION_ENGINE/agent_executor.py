from __future__ import annotations

import json
import sys
import time
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

from .agent_context import AgentMissionContext, AgentProfile
from .agent_cost_tracker import AgentCostTracker
from .agent_evidence_bridge import AgentEvidenceBridge
from .agent_health_monitor import AgentHealthMonitor
from .agent_llm_bridge import AgentLLMBridge
from .agent_memory_bridge import AgentMemoryBridge

models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["Agent", "AgentExecution", "KnowledgeQuery"])
Agent = models.Agent
AgentExecution = models.AgentExecution
KnowledgeQuery = models.KnowledgeQuery

ROOT = Path(__file__).resolve().parents[2]
KNOWLEDGE_DIR = ROOT / "07_KNOWLEDGE_ENGINE"
if str(KNOWLEDGE_DIR) not in sys.path:
    sys.path.insert(0, str(KNOWLEDGE_DIR))

from knowledge_search import search as knowledge_search  # noqa: E402
from knowledge_ranker import rank as knowledge_rank  # noqa: E402


class AgentExecutor:
    def __init__(self, db: Session):
        self.db = db
        self.llm = AgentLLMBridge()
        self.memory = AgentMemoryBridge(db)
        self.evidence = AgentEvidenceBridge(db)
        self.costs = AgentCostTracker(db)
        self.health = AgentHealthMonitor(db)

    def execute(self, profile: AgentProfile, mission_id: str, mission: str) -> dict:
        context = AgentMissionContext(mission_id=str(mission_id), mission=mission, profile=profile)
        self._ensure_agent_record(profile)
        self.health.mark_started(profile.name)
        started = time.perf_counter()
        execution = AgentExecution(
            mission_id=str(mission_id),
            agent=profile.name,
            status="RUNNING",
            mission=mission,
            started_at=datetime.utcnow(),
        )
        self.db.add(execution)
        self.db.commit()
        self.db.refresh(execution)

        try:
            context.knowledge = self._search_and_rank_knowledge(profile, mission)
            prompt = context.build_prompt()
            estimated_tokens = self.costs.estimate_tokens(prompt)
            llm_result = self.llm.route(str(mission_id), profile, prompt, estimated_tokens)
            context.llm_result = llm_result

            decision, result, confidence = self._build_result(profile, mission, context.knowledge, llm_result)
            context.decision = decision
            context.confidence = confidence

            elapsed_ms = int((time.perf_counter() - started) * 1000)
            tokens = self.costs.estimate_tokens(prompt, result)
            cost = self.costs.estimate_cost(
                llm_result.get("registry", {}),
                llm_result["provider"],
                tokens,
            )

            evidence_text = self._format_evidence(context, llm_result)
            evidence_record = self.evidence.record(
                mission_id=str(mission_id),
                agent=profile.name,
                decision=decision,
                evidence=evidence_text,
                confidence=confidence,
            )

            if profile.memory_enabled:
                self.memory.record_execution_cycle(
                    mission_id=str(mission_id),
                    agent=profile.name,
                    mission=mission,
                    decision=decision,
                    result=result,
                )

            self.costs.record(
                mission_id=str(mission_id),
                agent=profile.name,
                provider=llm_result["provider"],
                model=llm_result["model"],
                tokens=tokens,
                estimated_cost=cost,
                elapsed_ms=elapsed_ms,
            )

            if llm_result["fallback_used"] or llm_result["provider"] != profile.primary_llm:
                self.health.record_fallback(
                    mission_id=str(mission_id),
                    agent=profile.name,
                    primary_llm=profile.primary_llm,
                    fallback_llm=profile.fallback_llm,
                    provider_used=llm_result["provider"],
                    reason=llm_result["reason"],
                )

            execution.status = "COMPLETED" if llm_result["success"] else "COMPLETED_WITH_LLM_FAILURE"
            execution.decision = decision
            execution.result = result
            execution.confidence = confidence
            execution.llm_provider = llm_result["provider"]
            execution.llm_model = llm_result["model"]
            execution.fallback_used = bool(llm_result["fallback_used"])
            execution.finished_at = datetime.utcnow()
            execution.elapsed_ms = elapsed_ms
            self.db.commit()
            self.health.mark_completed(profile.name, elapsed_ms, bool(llm_result["fallback_used"]))

            return {
                "mission_id": str(mission_id),
                "agent": profile.name,
                "status": execution.status,
                "decision": decision,
                "result": result,
                "confidence": confidence,
                "llm": {
                    "provider": llm_result["provider"],
                    "model": llm_result["model"],
                    "router_used": True,
                    "fallback_used": llm_result["fallback_used"],
                    "success": llm_result["success"],
                    "reason": llm_result["reason"],
                },
                "evidence": evidence_record,
                "cost": {
                    "tokens": tokens,
                    "estimated_cost": cost,
                    "elapsed_ms": elapsed_ms,
                },
            }
        except Exception as exc:
            elapsed_ms = int((time.perf_counter() - started) * 1000)
            error = str(exc)
            execution.status = "FAILED"
            execution.result = error
            execution.finished_at = datetime.utcnow()
            execution.elapsed_ms = elapsed_ms
            self.db.commit()
            self.health.mark_failed(str(mission_id), profile.name, error)
            if profile.memory_enabled:
                self.memory.record_execution_cycle(
                    mission_id=str(mission_id),
                    agent=profile.name,
                    mission=mission,
                    decision="Execution failed",
                    result=error,
                    error=error,
                )
            raise

    def _ensure_agent_record(self, profile: AgentProfile) -> Agent:
        agent = self.db.query(Agent).filter(Agent.name == profile.name).first()
        if not agent:
            agent = Agent(name=profile.name, role=profile.role, status="IDLE")
            self.db.add(agent)
        else:
            agent.role = profile.role
            agent.status = "IDLE"
        self.db.commit()
        self.db.refresh(agent)
        self.health.ensure_agent(profile.name)
        return agent

    def _search_and_rank_knowledge(self, profile: AgentProfile, mission: str) -> list[dict]:
        queries = [mission, *profile.knowledge_domain]
        ranked_items = []
        for query in queries:
            raw = knowledge_search(query=query, agent_filter=profile.name, max_hits=20)
            ranked = knowledge_rank(raw.hits, top_n=5)
            response = json.dumps(
                [{"file": r.hit.file, "line": r.hit.line, "score": r.final_score} for r in ranked],
                ensure_ascii=False,
            )
            self.db.add(KnowledgeQuery(query=query, response=response, confidence=0.85 if ranked else 0.25, source="FILE_KNOWLEDGE_ENGINE"))
            for item in ranked:
                ranked_items.append(
                    {
                        "agent": item.hit.agent,
                        "file": item.hit.file,
                        "line_number": item.hit.line_number,
                        "line": item.hit.line,
                        "context": item.hit.context,
                        "score": item.final_score,
                    }
                )
        self.db.commit()
        ranked_items.sort(key=lambda item: item["score"], reverse=True)
        return ranked_items[:10]

    def _build_result(self, profile: AgentProfile, mission: str, knowledge: list[dict], llm_result: dict) -> tuple[str, str, float]:
        if llm_result["success"] and llm_result.get("response"):
            decision = f"{profile.name} executed mission through LLM Router"
            result = str(llm_result["response"])
            confidence = 0.9 if knowledge else 0.75
            return decision, result, confidence

        decision = f"{profile.name} executed mission with router exhaustion recorded"
        top_evidence = "; ".join(f"{k['file']}:{k['line_number']}" for k in knowledge[:3]) or "no local knowledge hit"
        result = (
            f"{profile.name} received mission '{mission}'. LLM Router was used but did not return a provider response "
            f"({llm_result['reason']}). Execution recorded evidence, memory, cost, and health using ranked knowledge: {top_evidence}."
        )
        confidence = 0.55 if knowledge else 0.35
        return decision, result, confidence

    def _format_evidence(self, context: AgentMissionContext, llm_result: dict) -> str:
        knowledge = "; ".join(
            f"{item['agent']}/{item['file']}:{item['line_number']} score={item['score']}"
            for item in context.knowledge[:5]
        ) or "No ranked knowledge evidence found."
        return (
            f"Router provider={llm_result['provider']} model={llm_result['model']} "
            f"success={llm_result['success']} reason={llm_result['reason']}. "
            f"Knowledge ranking: {knowledge}"
        )
