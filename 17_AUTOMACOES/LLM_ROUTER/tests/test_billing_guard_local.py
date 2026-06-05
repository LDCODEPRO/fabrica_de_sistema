import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from billing_guard import check_before_call


def test_local_allowed_without_token_cost():
    result = check_before_call(
        mission_id="mission_local",
        provider="ollama_local",
        estimated_cost=None,
        provider_type="local",
    )
    assert result.allowed
    assert result.reason == "LOCAL_ZERO_INCREMENTAL_OK"
