from agent_test_helpers import patched_router, reset_database, runtime_module


def test_agent_cost_tracking_and_health_monitor(monkeypatch):
    database, models = reset_database()
    patched_router(monkeypatch)
    runtime = runtime_module().AgentRuntime(database.SessionLocal())
    runtime.register_agents()

    result = runtime.execute_mission("ORCHESTRATOR", "104", "track tokens and health")

    cost = database.SessionLocal().query(models.AgentCost).filter_by(mission_id="104").first()
    assert cost is not None
    assert cost.provider == result["llm"]["provider"]
    assert cost.tokens > 0
    assert cost.estimated_cost == 0.0

    health = runtime.health()
    assert "ORCHESTRATOR" in health["average_elapsed_ms"]
    assert health["failures"]["ORCHESTRATOR"] == 0
