"""test_no_fake_provider.py — Garante que nenhum provider é simulado ou fantasma."""
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provider_registry.json")


def test_no_fake_status_active_without_evidence():
    """Nenhum provider pode ter active_real sem evidência operacional real."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p["health_status"] == "active_real":
            assert p.get("last_health_check"), (
                f"Provider {pid} marcado active_real sem timestamp de health check"
            )


def test_local_providers_have_no_env_var():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p.get("provider_type") == "local":
            assert p.get("env_var") is None, f"Provider local {pid} não deve exigir env_var"


def test_direct_providers_have_base_url():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p.get("automation_mode") == "direct" and p.get("provider_type") != "subscription":
            assert p.get("base_url"), f"Provider direto {pid} sem base_url"


def test_priority_order_is_correct():
    """Assinaturas priorizam DeepSeek V4 Pro; automação começa pelo Ollama local."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    assert data["routing_table"]["assisted"][0] == "deepseek_v4_pro"
    assert data["routing_table"]["automation"][0] == "ollama_local"


def test_subscriptions_are_not_token_billed_or_automated():
    """Assinaturas não podem ser tratadas como API paga nem automação direta (exceto gemini_advanced)."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p["provider_type"] == "subscription":
            if pid == "gemini_advanced":
                assert p["automation_mode"] == "direct"
                assert p["billing_mode"] == "fixed_subscription"
                assert p["cost_incremental"] == 0
                assert p["allowed_for_agents"] is True
            else:
                assert p["automation_mode"] == "assisted"
                assert p["billing_mode"] == "fixed_subscription"
                assert p["cost_incremental"] == 0
                assert p["allowed_for_agents"] is False


if __name__ == "__main__":
    tests = [
        test_no_fake_status_active_without_evidence,
        test_local_providers_have_no_env_var,
        test_direct_providers_have_base_url,
        test_priority_order_is_correct,
        test_subscriptions_are_not_token_billed_or_automated,
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
