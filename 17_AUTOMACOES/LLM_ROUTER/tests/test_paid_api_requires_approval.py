import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from billing_guard import check_before_call


def test_paid_api_blocked_without_director_approval():
    result = check_before_call(
        mission_id="mission_paid_api",
        provider="openai_api",
        estimated_cost=0.01,
        provider_type="paid_api",
        director_approved=False,
        secret_guard_ok=True,
        provider_health="active_real",
    )
    assert not result.allowed
    assert result.reason == "PAID_API_REQUIRES_DIRECTOR_APPROVAL"


def test_paid_api_blocked_without_active_health():
    result = check_before_call(
        mission_id="mission_paid_api",
        provider="openai_api",
        estimated_cost=0.01,
        provider_type="paid_api",
        director_approved=True,
        secret_guard_ok=True,
        provider_health="missing_key",
    )
    assert not result.allowed
    assert result.reason.startswith("PAID_API_HEALTH_NOT_ACTIVE_REAL")
