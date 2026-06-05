from agent_test_helpers import patched_router, reset_database, runtime_module


def test_agent_uses_llm_router_and_records_execution(monkeypatch):
    database, models = reset_database()
    patched_router(monkeypatch, response="LLM Router path used")
    runtime = runtime_module().AgentRuntime(database.SessionLocal())
    runtime.register_agents()

    result = runtime.execute_mission("ORCHESTRATOR", "101", "coordinate a production mission")

    assert result["status"] == "COMPLETED"
    assert result["llm"]["router_used"] is True
    assert result["llm"]["provider"] == "gemma4"
    assert result["result"] == "LLM Router path used"
    execution = database.SessionLocal().query(models.AgentExecution).filter_by(mission_id="101").first()
    assert execution is not None
    assert execution.llm_provider == "gemma4"
