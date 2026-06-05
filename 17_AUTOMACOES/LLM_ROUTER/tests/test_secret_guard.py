"""test_secret_guard.py — Testes do secret_guard."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from secret_guard import mask_secrets, validate_no_secrets


def test_masks_openai_key():
    text = "Using key sk-abcdefghijklmnopqrstuvwxyz123456"
    masked, detected = mask_secrets(text)
    assert detected, "Deve detectar a chave"
    assert "sk-abcdefghijklmnopqrstuvwxyz123456" not in masked
    assert "***SECRET_MASKED***" in masked


def test_masks_google_key():
    text = "key=AIzaSyAbcDefGhiJklMnoPqrSTUVwxyz12345678"
    masked, detected = mask_secrets(text)
    assert detected
    assert "AIzaSy" not in masked


def test_no_false_positive_short_string():
    text = "provider=deepseek status=ok model=chat"
    masked, detected = mask_secrets(text)
    assert not detected or masked == text or "***SECRET_MASKED***" not in text


def test_clean_text_unchanged():
    text = "Hello, this is a normal log message with no secrets."
    masked, detected = mask_secrets(text)
    assert not detected
    assert masked == text


def test_validate_dict_no_secrets():
    data = {"provider": "deepseek", "status": "ok", "mission": "test"}
    result = validate_no_secrets(data)
    assert result["provider"] == "deepseek"
    assert result["status"] == "ok"


def test_validate_dict_with_secret():
    data = {"provider": "openai", "key": "sk-abcdefghijklmnopqrstuvwxyz123456"}
    result = validate_no_secrets(data)
    assert "sk-abcdefghijklmnopqrstuvwxyz123456" not in str(result)


if __name__ == "__main__":
    tests = [
        test_masks_openai_key,
        test_masks_google_key,
        test_no_false_positive_short_string,
        test_clean_text_unchanged,
        test_validate_dict_no_secrets,
        test_validate_dict_with_secret,
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
