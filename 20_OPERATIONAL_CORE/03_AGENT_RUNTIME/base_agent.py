from sqlalchemy.orm import Session
models = __import__('20_OPERATIONAL_CORE.05_DATABASE.models', fromlist=['Agent', 'MemoryEntry'])
Agent = models.Agent
MemoryEntry = models.MemoryEntry

class BaseAgent:
    def __init__(self, role: str, db: Session):
        self.role = role
        self.db = db
        self.agent_record = self._get_or_create_agent()

    def _get_or_create_agent(self) -> Agent:
        agent = self.db.query(Agent).filter(Agent.role == self.role).first()
        if not agent:
            # Assuming name is Role Agent
            agent = Agent(name=f"{self.role.capitalize()} Agent", role=self.role, status="IDLE")
            self.db.add(agent)
            self.db.commit()
            self.db.refresh(agent)
        return agent

    def save_memory(self, context: str, data: str):
        mem = MemoryEntry(agent_id=self.agent_record.id, context=context, data=data)
        self.db.add(mem)
        self.db.commit()

    def get_memories(self):
        return self.db.query(MemoryEntry).filter(MemoryEntry.agent_id == self.agent_record.id).all()

    def query_knowledge_engine(self, query: str):
        # Simulated internal call to the API module
        main_api = __import__("20_OPERATIONAL_CORE.04_KNOWLEDGE_API.main", fromlist=["internal_query"])
        internal_query = main_api.internal_query
        return internal_query(query, self.db)

    def execute(self, mission_description: str) -> str:
        self.agent_record.status = "WORKING"
        self.db.commit()
        
        try:
            # The specific logic is implemented by subclasses
            result = self.process(mission_description)
            self.save_memory("Mission Execution", result)
            return result
        finally:
            self.agent_record.status = "IDLE"
            self.db.commit()

    def process(self, mission_description: str) -> str:
        raise NotImplementedError("Subclasses must implement this method")
