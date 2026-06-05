import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from cost_zero_policy import incremental_cost


def test_subscription_incremental_cost_zero():
    provider = {"provider_type": "subscription", "billing_mode": "fixed_subscription"}
    assert incremental_cost(provider, 50000) == 0.0


def test_local_incremental_cost_zero():
    provider = {"provider_type": "local", "billing_mode": "local_zero_incremental"}
    assert incremental_cost(provider, 50000) == 0.0


def test_paid_api_unknown_cost_stays_unknown_without_real_rates():
    provider = {"provider_type": "paid_api", "billing_mode": "token_based"}
    assert incremental_cost(provider, 50000) is None
