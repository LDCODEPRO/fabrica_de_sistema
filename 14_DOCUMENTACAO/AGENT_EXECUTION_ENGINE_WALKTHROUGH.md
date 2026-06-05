# AGENT_EXECUTION_ENGINE_WALKTHROUGH

Date: 2026-06-05

## Flow

```text
Mission
-> AgentRuntime
-> AgentExecutor
-> Knowledge Search
-> Knowledge Ranking
-> AgentLLMBridge
-> LLM Router
-> Provider Registry
-> Provider
-> Evidence
-> Memory
-> Cost
-> Health
```

## Rule

No agent calls a provider directly. Every execution must pass through `AgentLLMBridge` and `LLMRouter`.

## Runtime Usage

```python
import importlib

runtime_mod = importlib.import_module(
    "20_OPERATIONAL_CORE.08_AGENT_EXECUTION_ENGINE.agent_runtime"
)

runtime = runtime_mod.AgentRuntime()
runtime.register_agents()
result = runtime.execute_mission(
    agent_name="ORCHESTRATOR",
    mission_id="MISSION-001",
    mission="Coordinate a production mission",
)
```

## Current Status

Engine implemented and tests passing. Final certification is blocked because local providers `gemma4` and `ollama` returned HTTP 404 during real smoke execution.
