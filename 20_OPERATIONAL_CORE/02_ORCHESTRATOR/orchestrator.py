from sqlalchemy.orm import Session
models = __import__("20_OPERATIONAL_CORE.05_DATABASE.models", fromlist=["Mission", "Agent", "AuditLog"])
Mission = models.Mission
Agent = models.Agent
AuditLog = models.AuditLog

engine_mod = __import__("20_OPERATIONAL_CORE.01_MISSION_ENGINE.mission_engine", fromlist=["MissionEngine"])
MissionEngine = engine_mod.MissionEngine

class Orchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.mission_engine = MissionEngine(db)

    def process_mission(self, mission_id: int):
        mission = self.mission_engine.registry.get_mission(mission_id)
        if not mission or mission.status != "QUEUED":
            raise ValueError(f"Mission {mission_id} is not in QUEUED state.")

        self.mission_engine.start_mission(mission_id)
        
        try:
            # Fluxo obrigatorio: ORCHESTRATOR -> KNOWLEDGE ENGINE -> ESPECIALISTA -> EVIDENCE SYSTEM -> RESULTADO
            
            # Placeholder for Workflow Router
            router_mod = __import__("20_OPERATIONAL_CORE.02_ORCHESTRATOR.workflow_router", fromlist=["WorkflowRouter"])
            WorkflowRouter = router_mod.WorkflowRouter
            router = WorkflowRouter(self.db)
            agent_role = router.determine_agent(mission)
            
            # Select Agent
            agent = self.db.query(Agent).filter(Agent.role == agent_role).first()
            if not agent:
                # Fallback to test dummy logic instead of crashing if agent not seeded
                name = f"{agent_role} Agent"
            else:
                name = agent.name
                # Log Orchestration Step
                self.db.add(AuditLog(event_type="ORCHESTRATION_ROUTE", details=f"Mission {mission_id} routed to {agent.name} ({agent_role})"))
                self.db.commit()

            # Delegate to Agent Runtime (simulated call since actual integration happens inside Agent implementation)
            specialist_module = __import__("20_OPERATIONAL_CORE.03_AGENT_RUNTIME.specialist_agents", fromlist=["get_agent_instance"])
            get_agent_instance = specialist_module.get_agent_instance
            specialist = get_agent_instance(agent_role, self.db)
            result = specialist.execute(mission.description)

            # Register Evidence
            self.mission_engine.register_evidence(mission_id, f"Execution output from {name}", file_path=None)

            # Complete
            self.mission_engine.complete_mission(mission_id)
            return result

        except Exception as e:
            self.mission_engine.fail_mission(mission_id, str(e))
            raise
