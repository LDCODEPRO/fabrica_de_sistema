"""
billing_guard.py — Controle de custos antes de qualquer chamada a API paga.
Bloqueia quando limites são excedidos e direciona para fallback local.
"""
import os
import json
import logging
from datetime import date
from pathlib import Path
from typing import Optional

from cost_zero_policy import PAID_API, SUBSCRIPTION, LOCAL

logger = logging.getLogger(__name__)

LIMITS = {
    "per_mission": {"soft": 0.25, "hard": 0.50},
    "daily":       {"soft": 2.00, "hard": 5.00},
    "weekly":      {"soft": 10.00, "hard": 20.00},
}

COST_FILE = Path(__file__).parent / "reports" / "billing_state.json"


def _load_state() -> dict:
    if COST_FILE.exists():
        try:
            return json.loads(COST_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"daily": {}, "weekly": {}, "missions": {}}


def _save_state(state: dict) -> None:
    COST_FILE.parent.mkdir(parents=True, exist_ok=True)
    COST_FILE.write_text(json.dumps(state, indent=2, default=str), encoding="utf-8")


def get_daily_spent() -> float:
    state = _load_state()
    today = str(date.today())
    return state.get("daily", {}).get(today, 0.0)


def get_mission_spent(mission_id: str) -> float:
    state = _load_state()
    return state.get("missions", {}).get(mission_id, 0.0)


def record_cost(mission_id: str, cost: float, provider: str) -> None:
    """Registra custo APÓS chamada bem-sucedida."""
    state = _load_state()
    today = str(date.today())

    state.setdefault("daily", {})[today] = state["daily"].get(today, 0.0) + cost
    state.setdefault("missions", {})[mission_id] = state["missions"].get(mission_id, 0.0) + cost

    logger.info(
        "BILLING_RECORD mission=%s provider=%s cost=%.6f daily_total=%.4f",
        mission_id, provider, cost, state["daily"][today]
    )
    _save_state(state)


class BillingGuardResult:
    def __init__(self, allowed: bool, reason: str, use_fallback: bool = False):
        self.allowed = allowed
        self.reason = reason
        self.use_fallback = use_fallback

    def __bool__(self):
        return self.allowed


def check_before_call(
    mission_id: str,
    provider: str,
    estimated_cost: Optional[float],
    is_local: bool = False,
    provider_type: Optional[str] = None,
    director_approved: bool = False,
    secret_guard_ok: bool = True,
    provider_health: str = "unknown",
) -> BillingGuardResult:
    """
    Verifica se a chamada pode prosseguir.
    Retorna BillingGuardResult com decisão e motivo.
    """
    if is_local or provider_type == LOCAL:
        return BillingGuardResult(True, "LOCAL_ZERO_INCREMENTAL_OK")

    if provider_type == SUBSCRIPTION:
        return BillingGuardResult(True, "SUBSCRIPTION_ZERO_INCREMENTAL_OK")

    if provider_type == PAID_API:
        if not director_approved:
            return BillingGuardResult(False, "PAID_API_REQUIRES_DIRECTOR_APPROVAL", use_fallback=True)
        if not secret_guard_ok:
            return BillingGuardResult(False, "PAID_API_BLOCKED_BY_SECRET_GUARD", use_fallback=True)
        if provider_health != "active_real":
            return BillingGuardResult(False, f"PAID_API_HEALTH_NOT_ACTIVE_REAL:{provider_health}", use_fallback=True)

    if estimated_cost is None:
        logger.warning("BILLING_GUARD BLOCK: custo desconhecido para provider=%s", provider)
        return BillingGuardResult(False, "UNKNOWN_COST_BLOCKED", use_fallback=True)

    daily_spent = get_daily_spent()
    mission_spent = get_mission_spent(mission_id)

    projected_daily = daily_spent + estimated_cost
    projected_mission = mission_spent + estimated_cost

    if projected_daily > LIMITS["daily"]["hard"]:
        logger.error(
            "BILLING_GUARD HARD_BLOCK: daily limit exceeded. spent=%.4f limit=%.2f",
            projected_daily, LIMITS["daily"]["hard"]
        )
        return BillingGuardResult(False, "DAILY_HARD_LIMIT_EXCEEDED", use_fallback=True)

    if projected_mission > LIMITS["per_mission"]["hard"]:
        logger.error(
            "BILLING_GUARD HARD_BLOCK: mission limit exceeded. mission=%s spent=%.4f",
            mission_id, projected_mission
        )
        return BillingGuardResult(False, "MISSION_HARD_LIMIT_EXCEEDED", use_fallback=True)

    if projected_daily > LIMITS["daily"]["soft"]:
        logger.warning(
            "BILLING_GUARD SOFT_WARN: daily soft limit approaching. spent=%.4f limit=%.2f",
            projected_daily, LIMITS["daily"]["soft"]
        )

    return BillingGuardResult(True, "OK")
