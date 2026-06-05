"""test_billing_guard.py — Testes do billing_guard."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from billing_guard import check_before_call, LIMITS


def test_local_always_allowed():
    result = check_before_call("mission_test", "ollama", None, is_local=True)
    assert result.allowed, "Provider local deve sempre ser permitido"
    assert result.reason == "LOCAL_FREE_OK"


def test_unknown_cost_blocked():
    result = check_before_call("mission_test", "openai", None, is_local=False)
    assert not result.allowed, "Custo desconhecido deve ser bloqueado"
    assert result.use_fallback


def test_small_cost_allowed():
    result = check_before_call("mission_clean", "deepseek", 0.001, is_local=False)
    assert result.allowed, "Custo pequeno deve ser permitido"
    assert result.reason == "OK"


def test_over_mission_hard_limit():
    result = check_before_call("mission_big", "openai", LIMITS["per_mission"]["hard"] + 0.01, is_local=False)
    assert not result.allowed, "Deve bloquear se exceder limite por missão"
    assert result.use_fallback


def test_over_daily_hard_limit():
    big_cost = LIMITS["daily"]["hard"] + 1.0
    result = check_before_call("mission_huge", "openai", big_cost, is_local=False)
    assert not result.allowed, "Deve bloquear se exceder limite diário"
    assert result.use_fallback


if __name__ == "__main__":
    tests = [
        test_local_always_allowed,
        test_unknown_cost_blocked,
        test_small_cost_allowed,
        test_over_mission_hard_limit,
        test_over_daily_hard_limit,
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
