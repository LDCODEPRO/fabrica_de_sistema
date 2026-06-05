from agent_test_helpers import reset_database, runtime_module


def test_agent_runtime_registers_required_profiles():
    database, models = reset_database()
    runtime_mod = runtime_module()
    runtime = runtime_mod.AgentRuntime(database.SessionLocal())

    profiles = runtime.register_agents()

    assert len(profiles) == 11
    assert {p["name"] for p in profiles} == {
        "ARCHITECT",
        "DEVELOPER",
        "QA",
        "DOCS",
        "ANALYST",
        "ORCHESTRATOR",
        "DESIGNER",
        "SECURITY",
        "DEVOPS",
        "DATA_ENGINEER",
        "AI_ENGINEER",
    }
    assert database.SessionLocal().query(models.Agent).count() == 11
