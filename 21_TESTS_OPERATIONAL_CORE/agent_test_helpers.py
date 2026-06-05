from __future__ import annotations

import importlib
import os
from pathlib import Path


TEST_DB = Path("agent_execution_test.db").resolve()
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"


def reset_database():
    database = importlib.import_module("20_OPERATIONAL_CORE.05_DATABASE.database")
    models = importlib.import_module("20_OPERATIONAL_CORE.05_DATABASE.models")
    database.Base.metadata.drop_all(bind=database.engine)
    database.Base.metadata.create_all(bind=database.engine)
    return database, models


def patched_router(monkeypatch, response: str = "Router execution completed"):
    bridge = importlib.import_module("20_OPERATIONAL_CORE.08_AGENT_EXECUTION_ENGINE.agent_llm_bridge")

    def fake_call_provider(self, provider_id, provider, prompt):
        assert provider_id in self.registry["providers"]
        assert "Mission ID:" in prompt
        return response

    monkeypatch.setattr(bridge.LLMRouter, "_call_provider", fake_call_provider)


def runtime_module():
    return importlib.import_module("20_OPERATIONAL_CORE.08_AGENT_EXECUTION_ENGINE.agent_runtime")
