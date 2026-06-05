from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Mission'])
Mission = models.Mission

class WorkflowRouter:
    def __init__(self, db: Session):
        self.db = db

    def determine_agent(self, mission: Mission) -> str:
        """
        Determines the appropriate agent role based on the mission context.
        Real implementation: Keyword/Semantic mapping against Agent Manifests.
        """
        desc = mission.description.lower()
        if "design" in desc or "ui" in desc:
            return "DESIGNER"
        elif "test" in desc or "qa" in desc:
            return "QA"
        elif "deploy" in desc or "infra" in desc:
            return "DEVOPS"
        elif "data" in desc or "pipeline" in desc:
            return "DATA_ENGINEER"
        elif "model" in desc or "ai" in desc:
            return "AI_ENGINEER"
        elif "architecture" in desc or "system" in desc:
            return "ARCHITECT"
        elif "doc" in desc or "write" in desc:
            return "DOCS"
        elif "security" in desc or "audit" in desc:
            return "SECURITY"
        
        # Default fallback
        return "DEVELOPER"
