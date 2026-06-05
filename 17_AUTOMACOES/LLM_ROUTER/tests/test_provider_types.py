import json
import os

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "provider_registry.json")


def _providers():
    return json.loads(open(REGISTRY_PATH, encoding="utf-8").read())["providers"]


def test_official_provider_types_are_valid():
    valid = {"subscription", "local", "paid_api"}
    for pid, provider in _providers().items():
        assert provider["provider_type"] in valid, f"{pid} tipo inválido"


def test_subscriptions_are_not_token_billed():
    for pid, provider in _providers().items():
        if provider["provider_type"] == "subscription":
            assert provider["billing_mode"] == "fixed_subscription"
            assert provider["cost_incremental"] == 0


def test_local_is_zero_incremental():
    for pid, provider in _providers().items():
        if provider["provider_type"] == "local":
            assert provider["billing_mode"] == "local_zero_incremental"
            assert provider["cost_incremental"] == 0
            assert provider["requires_api_key"] is False
