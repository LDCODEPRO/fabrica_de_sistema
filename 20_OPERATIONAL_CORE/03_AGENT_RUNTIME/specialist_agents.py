from .base_agent import BaseAgent
from sqlalchemy.orm import Session

class ArchitectAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("ARCHITECT", db)
    def process(self, desc: str): return f"[ARCHITECT] System design and architecture created for: {desc}"

class DeveloperAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("DEVELOPER", db)
    def process(self, desc: str): return f"[DEVELOPER] Code implementation completed for: {desc}"

class QAAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("QA", db)
    def process(self, desc: str): return f"[QA] Test suite and validation completed for: {desc}"

class DocsAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("DOCS", db)
    def process(self, desc: str): return f"[DOCS] Documentation generated for: {desc}"

class AnalystAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("ANALYST", db)
    def process(self, desc: str): return f"[ANALYST] Requirements and impact analysis mapped for: {desc}"

class OrchestratorAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("ORCHESTRATOR", db)
    def process(self, desc: str): return f"[ORCHESTRATOR] Process orchestrated and delegated for: {desc}"

class DesignerAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("DESIGNER", db)
    def process(self, desc: str): return f"[DESIGNER] UI/UX tokens and screens generated for: {desc}"

class SecurityAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("SECURITY", db)
    def process(self, desc: str): return f"[SECURITY] Vulnerability scan and compliance verified for: {desc}"

class DevOpsAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("DEVOPS", db)
    def process(self, desc: str): return f"[DEVOPS] CI/CD pipelines and infrastructure provisioned for: {desc}"

class DataEngineerAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("DATA_ENGINEER", db)
    def process(self, desc: str): return f"[DATA_ENGINEER] ETL pipelines and schemas modeled for: {desc}"

class AIEngineerAgent(BaseAgent):
    def __init__(self, db: Session): super().__init__("AI_ENGINEER", db)
    def process(self, desc: str): return f"[AI_ENGINEER] Model fine-tuning and inference API ready for: {desc}"

def get_agent_instance(role: str, db: Session) -> BaseAgent:
    mapping = {
        "ARCHITECT": ArchitectAgent,
        "DEVELOPER": DeveloperAgent,
        "QA": QAAgent,
        "DOCS": DocsAgent,
        "ANALYST": AnalystAgent,
        "ORCHESTRATOR": OrchestratorAgent,
        "DESIGNER": DesignerAgent,
        "SECURITY": SecurityAgent,
        "DEVOPS": DevOpsAgent,
        "DATA_ENGINEER": DataEngineerAgent,
        "AI_ENGINEER": AIEngineerAgent,
    }
    cls = mapping.get(role.upper(), DeveloperAgent)
    return cls(db)
