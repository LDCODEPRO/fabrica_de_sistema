"""Impede health fantasma em adapters de provider."""
import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_api_health_checks_do_not_mark_active_real_from_key_only():
    modules = [
        "providers.openai_api_provider",
        "providers.openai_codex_provider",
        "providers.deepseek_provider",
        "providers.gemini_provider",
        "providers.anthropic_api_provider",
    ]
    for module_name in modules:
        module = importlib.import_module(module_name)
        result = module.health_check()
        assert result["status"] != "ACTIVE_REAL"
        assert result["status"] != "SUBSCRIPTION_OK"


def test_claude_code_detection_is_not_subscription_certification():
    module = importlib.import_module("providers.claude_code_provider")
    result = module.health_check()
    assert result["status"] != "SUBSCRIPTION_OK"

