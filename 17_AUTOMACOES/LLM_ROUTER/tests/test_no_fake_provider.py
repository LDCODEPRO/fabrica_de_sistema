"""test_no_fake_provider.py — Garante que nenhum provider é simulado ou fantasma."""
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provider_registry.json")


def test_no_fake_status_active_without_evidence():
    """Nenhum provider pode ter ACTIVE_REAL sem ter sido testado realmente."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p["status"] == "ACTIVE_REAL":
            is_local = p.get("local", False)
            has_key_var = p.get("env_var") is not None
            has_subscription = p.get("subscription_active", False)
            assert is_local or has_key_var or has_subscription, (
                f"Provider {pid} marcado ACTIVE_REAL sem evidência de credencial ou assinatura"
            )


def test_local_providers_have_no_env_var():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        if p.get("local"):
            assert p.get("env_var") is None, f"Provider local {pid} não deve exigir env_var"


def test_all_providers_have_base_url():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for pid, p in data["providers"].items():
        assert p.get("base_url"), f"Provider {pid} sem base_url"


def test_priority_order_is_correct():
    """Deepseek deve ser prioridade 1, Ollama deve ser prioridade >= 5."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    assert data["providers"]["deepseek"]["priority"] == 1
    assert data["providers"]["ollama"]["priority"] >= 5


def test_subscription_ok_only_for_verified():
    """SUBSCRIPTION_OK só pode ser dado a providers com evidência real."""
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    verified_subscription = {"anthropic"}
    for pid, p in data["providers"].items():
        if p["status"] == "SUBSCRIPTION_OK":
            assert pid in verified_subscription, (
                f"Provider {pid} marcado SUBSCRIPTION_OK sem verificação real"
            )


if __name__ == "__main__":
    tests = [
        test_no_fake_status_active_without_evidence,
        test_local_providers_have_no_env_var,
        test_all_providers_have_base_url,
        test_priority_order_is_correct,
        test_subscription_ok_only_for_verified,
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
