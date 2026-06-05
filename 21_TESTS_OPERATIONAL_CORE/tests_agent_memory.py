from agent_test_helpers import patched_router, reset_database, runtime_module


def test_agent_memory_persists_execution_cycle(monkeypatch):
    database, models = reset_database()
    patched_router(monkeypatch)
    runtime = runtime_module().AgentRuntime(database.SessionLocal())
    runtime.register_agents()

    runtime.execute_mission("ORCHESTRATOR", "102", "persist mission memory")

    memories = database.SessionLocal().query(models.AgentMemory).filter_by(mission_id="102").all()
    memory_types = {m.memory_type for m in memories}
    assert {"MISSION", "DECISION", "LEARNING", "RESULT"}.issubset(memory_types)
