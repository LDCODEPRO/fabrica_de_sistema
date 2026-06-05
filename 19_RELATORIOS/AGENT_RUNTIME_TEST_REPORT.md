# AGENT_RUNTIME_TEST_REPORT

Mission: AGENT_EXECUTION_ENGINE_V1
Date: 2026-06-05

## Test Files

```text
21_TESTS_OPERATIONAL_CORE/tests_agent_runtime.py
21_TESTS_OPERATIONAL_CORE/tests_agent_router.py
21_TESTS_OPERATIONAL_CORE/tests_agent_memory.py
21_TESTS_OPERATIONAL_CORE/tests_agent_evidence.py
21_TESTS_OPERATIONAL_CORE/tests_agent_costs.py
```

## Result

```text
5 passed, 68 warnings in 2.18s
```

Warnings are deprecation warnings around `datetime.utcnow()` from SQLAlchemy/defaults and existing router code. They did not fail runtime behavior.

## Coverage By Requirement

```text
Runtime profiles registered .... OK
Router path used ............... OK
Agent execution persisted ...... OK
Memory persisted ............... OK
Evidence persisted ............. OK
Cost persisted ................. OK
Health snapshot persisted ...... OK
```

## Real Smoke Test

Command executed a real ORCHESTRATOR mission without monkeypatch and with local-only router path.

Result:

```json
{
  "status": "COMPLETED_WITH_LLM_FAILURE",
  "provider": "none",
  "router_success": false,
  "reason": "ALL_PROVIDERS_FAILED",
  "cost": {
    "tokens": 279,
    "estimated_cost": 0.0,
    "elapsed_ms": 4161
  }
}
```

Router logs:

```text
PROVIDER_FAILED provider=gemma4 error=HTTP Error 404: Not Found
PROVIDER_FAILED provider=ollama error=HTTP Error 404: Not Found
LLM_ROUTER EXHAUSTED mission=9001 task=simple
```

## Test Certification

Automated tests pass. Production live completion depends on provisioning the local Ollama models or approved API credentials.

## Compose Validation

`docker compose config` executed successfully after making `.env` optional and keeping the service healthcheck active.
