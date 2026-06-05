from __future__ import annotations

from sqlalchemy.orm import Session

from .agent_context import AgentProfile
from .agent_executor import AgentExecutor

database = __import__("20_OPERATIONAL_CORE.05_DATABASE.database", fromlist=["Base", "engine", "SessionLocal"])
models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["Agent"])
Base = database.Base
engine = database.engine
SessionLocal = database.SessionLocal
Agent = models.Agent


AGENT_PROFILES: dict[str, AgentProfile] = {
    "ARCHITECT": AgentProfile(
        name="ARCHITECT",
        role="System architecture and technical decision authority",
        primary_llm="deepseek",
        fallback_llm="anthropic",
        knowledge_domain=["architecture", "patterns", "system design"],
    ),
    "DEVELOPER": AgentProfile(
        name="DEVELOPER",
        role="Code implementation and refactoring",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["development", "coding", "implementation"],
    ),
    "QA": AgentProfile(
        name="QA",
        role="Quality assurance, tests, and validation",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["qa", "testing", "validation"],
    ),
    "DOCS": AgentProfile(
        name="DOCS",
        role="Documentation and operational knowledge",
        primary_llm="gemini",
        fallback_llm="anthropic",
        knowledge_domain=["documentation", "readme", "knowledge base"],
    ),
    "ANALYST": AgentProfile(
        name="ANALYST",
        role="Requirements, business analysis, and impact mapping",
        primary_llm="gemini",
        fallback_llm="openai",
        knowledge_domain=["analysis", "requirements", "impact"],
    ),
    "ORCHESTRATOR": AgentProfile(
        name="ORCHESTRATOR",
        role="Mission coordination and agent delegation",
        primary_llm="gemma4",
        fallback_llm="ollama",
        knowledge_domain=["orchestration", "workflow", "mission"],
    ),
    "DESIGNER": AgentProfile(
        name="DESIGNER",
        role="Experience design and interface decisions",
        primary_llm="gemini",
        fallback_llm="openai",
        knowledge_domain=["design", "ui", "ux"],
    ),
    "SECURITY": AgentProfile(
        name="SECURITY",
        role="Security review, policy, and risk controls",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["security", "audit", "risk"],
    ),
    "DEVOPS": AgentProfile(
        name="DEVOPS",
        role="Deployment, infrastructure, and operations",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["devops", "docker", "deployment"],
    ),
    "DATA_ENGINEER": AgentProfile(
        name="DATA_ENGINEER",
        role="Data pipelines, schemas, and persistence",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["data", "database", "etl"],
    ),
    "AI_ENGINEER": AgentProfile(
        name="AI_ENGINEER",
        role="AI systems, models, and inference workflows",
        primary_llm="deepseek",
        fallback_llm="openai",
        knowledge_domain=["ai", "llm", "agents"],
    ),
}


class AgentRuntime:
    def __init__(self, db: Session | None = None):
        initialize_agent_execution_database()
        self.db = db or SessionLocal()
        self.executor = AgentExecutor(self.db)

    def register_agents(self) -> list[dict]:
        registered = []
        for profile in AGENT_PROFILES.values():
            agent = self.db.query(Agent).filter(Agent.name == profile.name).first()
            if not agent:
                agent = Agent(name=profile.name, role=profile.role, status="IDLE")
                self.db.add(agent)
            else:
                agent.role = profile.role
            registered.append(profile.as_dict())
        self.db.commit()
        return registered

    def execute_mission(self, agent_name: str, mission_id: str, mission: str) -> dict:
        profile = self.get_profile(agent_name)
        return self.executor.execute(profile=profile, mission_id=str(mission_id), mission=mission)

    def execute_all(self, mission_id: str, mission: str) -> list[dict]:
        return [
            self.execute_mission(agent_name=name, mission_id=mission_id, mission=mission)
            for name in AGENT_PROFILES
        ]

    def health(self) -> dict:
        return self.executor.health.snapshot()

    @staticmethod
    def get_profile(agent_name: str) -> AgentProfile:
        key = agent_name.upper()
        if key not in AGENT_PROFILES:
            raise ValueError(f"Unknown agent: {agent_name}")
        return AGENT_PROFILES[key]


def initialize_agent_execution_database() -> None:
    """Idempotent database migration for agent execution tables."""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    runtime = AgentRuntime()
    runtime.register_agents()
    print("AGENT_EXECUTION_ENGINE initialized")
