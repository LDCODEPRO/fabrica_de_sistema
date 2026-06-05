"""test_provider_registry.py — Valida integridade do provider_registry.json."""
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provider_registry.json")

REQUIRED_FIELDS = [
    "provider_name", "display_name", "provider_type", "automation_mode",
    "billing_mode", "cost_incremental", "requires_api_key",
    "requires_director_approval", "health_status", "last_health_check",
    "allowed_for_agents", "notes"
]
VALID_STATUSES = {"unknown", "active_real", "inactive", "missing_key", "unavailable"}
REQUIRED_PROVIDERS = {"deepseek_v4_pro", "claude_pro", "chatgpt_plus", "gemini_advanced", "ollama_local"}


def test_registry_loads():
    assert os.path.exists(REGISTRY_PATH), "provider_registry.json deve existir"
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    assert "providers" in data
    assert "routing_table" in data


def test_all_required_providers_present():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    providers = set(data["providers"].keys())
    missing = REQUIRED_PROVIDERS - providers
    assert not missing, f"Providers ausentes: {missing}"


def test_all_providers_have_required_fields():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        for field in REQUIRED_FIELDS:
            assert field in p, f"Provider {pid} faltando campo '{field}'"


def test_all_statuses_valid():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        assert p["health_status"] in VALID_STATUSES, f"Provider {pid} tem status inválido: {p['health_status']}"


def test_no_api_keys_in_registry():
    """Garante que nenhuma chave real foi colocada no registry."""
    content = open(REGISTRY_PATH, encoding="utf-8").read()
    assert "sk-" not in content, "API key OpenAI detectada no registry!"
    assert "AIza" not in content, "API key Google detectada no registry!"
    assert "AKIA" not in content, "AWS key detectada no registry!"


def test_routing_table_covers_main_task_types():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    required = {"architecture", "coding", "audit", "documentation", "research", "fallback"}
    routing = set(data["routing_table"].keys())
    missing = required - routing
    assert not missing, f"Task types ausentes no routing_table: {missing}"


if __name__ == "__main__":
    tests = [
        test_registry_loads,
        test_all_required_providers_present,
        test_all_providers_have_required_fields,
        test_all_statuses_valid,
        test_no_api_keys_in_registry,
        test_routing_table_covers_main_task_types,
    ]
    passed = 0
    failed = 0
    for t in tests:
        try:
            t()
            print(f"  [OK] {t.__name__}")
            passed += 1
        except AssertionError as e:
            print(f"  [FAIL] {t.__name__}: {e}")
            failed += 1
        except Exception as e:
            print(f"  [FAIL] {t.__name__}: EXCEPTION {e}")
            failed += 1
    print(f"\nRESULT: {passed} passed, {failed} failed")
    sys.exit(0 if failed == 0 else 1)
