"""test_llm_hierarchy.py — Valida que a hierarquia de roteamento está correta."""
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provider_registry.json")


def _routing(task_type: str) -> list:
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    return data["routing_table"].get(task_type, [])


def test_architecture_first_is_deepseek():
    chain = _routing("architecture")
    assert chain[0] == "deepseek", f"Arquitetura: primeiro deve ser deepseek, foi {chain[0]}"


def test_coding_first_is_deepseek():
    chain = _routing("coding")
    assert chain[0] == "deepseek", f"Coding: primeiro deve ser deepseek, foi {chain[0]}"


def test_documentation_first_is_gemini():
    chain = _routing("documentation")
    assert chain[0] == "gemini", f"Documentação: primeiro deve ser gemini, foi {chain[0]}"


def test_research_first_is_gemini():
    chain = _routing("research")
    assert chain[0] == "gemini", f"Pesquisa: primeiro deve ser gemini, foi {chain[0]}"


def test_fallback_chain_ends_with_local():
    chain = _routing("fallback")
    locals_ = {"gemma4", "ollama"}
    assert any(p in locals_ for p in chain), "Fallback deve incluir provider local"


def test_all_chains_end_with_local_option():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    locals_ = {"gemma4", "ollama"}
    for task, chain in data["routing_table"].items():
        if task == "multimodal":
            continue
        has_local = any(p in locals_ for p in chain)
        assert has_local, f"Cadeia '{task}' deve incluir fallback local"


def test_no_provider_appears_twice_in_chain():
    data = json.loads(open(REGISTRY_PATH, encoding="utf-8").read())
    for task, chain in data["routing_table"].items():
        seen = set()
        for p in chain:
            assert p not in seen, f"Provider '{p}' aparece duas vezes em '{task}'"
            seen.add(p)


if __name__ == "__main__":
    tests = [
        test_architecture_first_is_deepseek,
        test_coding_first_is_deepseek,
        test_documentation_first_is_gemini,
        test_research_first_is_gemini,
        test_fallback_chain_ends_with_local,
        test_all_chains_end_with_local_option,
        test_no_provider_appears_twice_in_chain,
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
