from agent_test_helpers import patched_router, reset_database, runtime_module


def test_agent_evidence_is_recorded_in_database_and_file(monkeypatch):
    database, models = reset_database()
    patched_router(monkeypatch)
    runtime = runtime_module().AgentRuntime(database.SessionLocal())
    runtime.register_agents()

    result = runtime.execute_mission("ORCHESTRATOR", "103", "generate execution evidence")

    evidence = result["evidence"]
    assert evidence["mission_id"] == "103"
    assert evidence["agent"] == "ORCHESTRATOR"
    assert evidence["decision"]
    assert evidence["evidence"]
    assert evidence["confidence"] > 0
    assert database.SessionLocal().query(models.Evidence).count() >= 1
