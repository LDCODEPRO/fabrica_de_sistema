"""Política oficial de baixo custo para provedores de IA."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


SUBSCRIPTION = "subscription"
LOCAL = "local"
PAID_API = "paid_api"

ASSISTED = "assisted"
DIRECT = "direct"
CONNECTOR = "connector"
UNAVAILABLE = "unavailable"

FIXED_SUBSCRIPTION = "fixed_subscription"
LOCAL_ZERO_INCREMENTAL = "local_zero_incremental"
TOKEN_BASED = "token_based"
NOT_APPLICABLE = "not_applicable"


@dataclass(frozen=True)
class ProviderDecision:
    allowed: bool
    reason: str
    incremental_cost: Optional[float] = None
    use_fallback: bool = False


def is_subscription(provider: dict) -> bool:
    return provider.get("provider_type") == SUBSCRIPTION


def is_local(provider: dict) -> bool:
    return provider.get("provider_type") == LOCAL or provider.get("local") is True


def is_paid_api(provider: dict) -> bool:
    return provider.get("provider_type") == PAID_API


def incremental_cost(provider: dict, estimated_tokens: int = 0) -> Optional[float]:
    """Retorna custo incremental apenas quando a política permite cálculo."""
    if is_subscription(provider) or is_local(provider):
        return 0.0
    if not is_paid_api(provider):
        return None
    if provider.get("billing_mode") != TOKEN_BASED:
        return None
    input_cost = provider.get("cost_per_1k_input")
    output_cost = provider.get("cost_per_1k_output")
    if input_cost is None or output_cost is None:
        return None
    return (estimated_tokens / 1000) * (float(input_cost) + float(output_cost))


def can_use_provider(
    provider: dict,
    *,
    director_approved: bool = False,
    billing_guard_ok: bool = False,
    secret_guard_ok: bool = False,
    require_active_health: bool = True,
) -> ProviderDecision:
    """Aplica a regra da Diretoria antes de qualquer chamada real."""
    health = provider.get("health_status", "unknown")
    provider_type = provider.get("provider_type")

    if require_active_health and health != "active_real":
        return ProviderDecision(False, f"HEALTH_NOT_ACTIVE_REAL:{health}", use_fallback=True)

    if provider_type == SUBSCRIPTION:
        if provider.get("billing_mode") == TOKEN_BASED:
            return ProviderDecision(False, "SUBSCRIPTION_CANNOT_BE_TOKEN_BILLED")
        if provider.get("automation_mode") not in {ASSISTED, CONNECTOR}:
            return ProviderDecision(False, "SUBSCRIPTION_AUTOMATION_NOT_AVAILABLE")
        return ProviderDecision(True, "SUBSCRIPTION_ZERO_INCREMENTAL_OK", 0.0)

    if provider_type == LOCAL:
        if provider.get("billing_mode") == TOKEN_BASED:
            return ProviderDecision(False, "LOCAL_CANNOT_BE_TOKEN_BILLED")
        if provider.get("automation_mode") != DIRECT:
            return ProviderDecision(False, "LOCAL_REQUIRES_DIRECT_AUTOMATION")
        return ProviderDecision(True, "LOCAL_ZERO_INCREMENTAL_OK", 0.0)

    if provider_type == PAID_API:
        if not provider.get("requires_director_approval", True):
            return ProviderDecision(False, "PAID_API_MUST_REQUIRE_DIRECTOR_APPROVAL")
        if not director_approved:
            return ProviderDecision(False, "PAID_API_BLOCKED_PENDING_DIRECTOR_APPROVAL", use_fallback=True)
        if not billing_guard_ok:
            return ProviderDecision(False, "PAID_API_BLOCKED_BY_BILLING_GUARD", use_fallback=True)
        if not secret_guard_ok:
            return ProviderDecision(False, "PAID_API_BLOCKED_BY_SECRET_GUARD", use_fallback=True)
        return ProviderDecision(True, "PAID_API_AUTHORIZED", None)

    return ProviderDecision(False, f"UNKNOWN_PROVIDER_TYPE:{provider_type}", use_fallback=True)
