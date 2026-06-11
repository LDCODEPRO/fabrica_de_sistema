"""Governança V006 dos provedores de IA da FORJA OS."""

from __future__ import annotations

import os
import time
from datetime import datetime, timezone
from typing import Iterable

import provider_router


STATUS_CERTIFIED = "CERTIFIED"
STATUS_ENV_PENDING = "ENVIRONMENT_PENDING"
STATUS_ROUTER_LIMITED = "ROUTER_LIMITED"
STATUS_OFFLINE = "OFFLINE"
STATUS_BLOCKED_BY_BILLING = "BLOCKED_BY_BILLING"
STATUS_NOT_IMPLEMENTED = "NOT_IMPLEMENTED"
STATUS_ERROR = "ERROR"
STATUS_FAILED_CODE = "FAILED_CODE"


PROVIDER_EXECUTION_MAP = {
    "claude_subscription": "claude_sub",
    "openai_subscription": "codex_sub",
    "gemini_subscription": "gemini_sub",
    "deepseek_v4_router": "openrouter",
    "kimi_k26_router": "openrouter",
    "claude_fable5_router": "openrouter",
    "ollama_local": "ollama",
}


PROVIDER_MODEL_OVERRIDE = {
    "deepseek_v4_router": "deepseek/deepseek-v4-pro",
    "kimi_k26_router": "moonshotai/kimi-k2.6",
    # Claude Fable 5 (Mythos-class, lançado 09/06/2026) via OpenRouter.
    "claude_fable5_router": "anthropic/claude-fable-5",
}


GROUP_ORDERS = {
    "conversation": [
        "claude_subscription",
        "openai_subscription",
        "gemini_subscription",
        "deepseek_v4_router",
        "kimi_k26_router",
        "ollama_local",
    ],
    "engineering": [
        "openai_subscription",
        "claude_subscription",
        "deepseek_v4_router",
        "kimi_k26_router",
        "gemini_subscription",
        "ollama_local",
    ],
    "low_cost": [
        "ollama_local",
        "kimi_k26_router",
        "deepseek_v4_router",
        "gemini_subscription",
        "openai_subscription",
        "claude_subscription",
    ],
}


AGENT_GROUPS = {
    "COMMUNICATION": "conversation",
    "SUPPORT": "conversation",
    "COMMERCIAL": "conversation",
    "ORCHESTRATOR": "engineering",
    "ARCHITECT": "engineering",
    "DEVELOPER": "engineering",
    "QA": "engineering",
    "DEVOPS": "engineering",
    "AI_ENGINEER": "engineering",
    "SECURITY": "engineering",
    "DATA_ENGINEER": "engineering",
    "ANALYST": "engineering",
    "DOCS": "low_cost",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def order_for_group(group: str) -> list[str]:
    return list(GROUP_ORDERS.get(group, GROUP_ORDERS["engineering"]))


def group_for_agent(agent_key: str) -> str:
    return AGENT_GROUPS.get((agent_key or "").upper(), "engineering")


def execution_order(provider_keys: Iterable[str]) -> list[str]:
    order = []
    for key in provider_keys:
        exec_key = PROVIDER_EXECUTION_MAP.get(key)
        if exec_key and exec_key not in order:
            order.append(exec_key)
    return order


def status_from_result(provider_key: str, result: dict) -> str:
    if result.get("ok"):
        if provider_key in {"deepseek_v4_router", "kimi_k26_router", "claude_fable5_router"}:
            return STATUS_ROUTER_LIMITED
        return STATUS_CERTIFIED

    error = result.get("error") or ""
    error_lower = error.lower()

    # 1. Check for FAILED_CODE (real code errors)
    code_exceptions = [
        "nameerror", "typeerror", "attributeerror", "syntaxerror", 
        "indexerror", "keyerror", "valueerror", "zerodivisionerror",
        "modulenotfounderror", "importerror", "jsondecodeerror", 
        "failed_code"
    ]
    if any(exc in error_lower for exc in code_exceptions):
        return STATUS_FAILED_CODE

    # 2. Check for BLOCKED_BY_BILLING
    billing_keywords = ["billing", "quota", "credit", "402", "balance", "blocked_by_billing", "budget"]
    if any(bk in error_lower for bk in billing_keywords):
        return STATUS_BLOCKED_BY_BILLING

    # 3. Check for OFFLINE (service/router did not respond)
    # For Ollama local, not installed/running means ENVIRONMENT_PENDING.
    # For APIs/Routers, no response is OFFLINE.
    offline_keywords = ["connection refused", "timeout", "urlerror", "unreachable", "timed out", "http 503", "http 502", "http 504"]
    if provider_key != "ollama_local":
        if any(okw in error_lower for okw in offline_keywords) or "http" in error_lower:
            return STATUS_OFFLINE

    # 4. Check for ENVIRONMENT_PENDING
    env_pending_keywords = [
        "ausente", "not recognized", "sem saída", "empty response", "vazia",
        "login", "session", "signin", "authenticate", "credentials", "auth",
        "disabled claude subscription", "expired", "not logged in", "approval-mode",
        "skip-trust", "unauthorized", "headless", "cli sem saída", "command not found",
        "change_me", "apikey ausente", "key ausente", "refused", "ollama_unavailable",
        "connection refused", "timeout",  # for ollama local, these mean daemon is not running
        # Conexão recusada em português/Windows (ollama desligado) e modelo de
        # router ainda não habilitado na conta — condições de AMBIENTE, não erros de código.
        "recusou", "10061", "máquina de destino", "sem modelo disponível",
    ]
    if any(ekw in error_lower for ekw in env_pending_keywords):
        return STATUS_ENV_PENDING

    # Default fallback for subscription CLIs
    if provider_key in {"claude_subscription", "openai_subscription", "gemini_subscription"}:
        return STATUS_ENV_PENDING

    return STATUS_ERROR


def check_provider(provider_key: str, prompt: str = "Responda apenas PROVIDER_OK", max_tokens: int = 256) -> dict:
    """Executa health check real, sem expor segredos."""
    exec_key = PROVIDER_EXECUTION_MAP.get(provider_key)
    if not exec_key:
        return {
            "provider_key": provider_key,
            "status": STATUS_NOT_IMPLEMENTED,
            "ok": False,
            "error": "provider sem adapter",
            "latency_ms": 0,
            "checked_at": now_iso(),
        }

    # Verify if configuration is missing / placeholder in environment
    if provider_key in {"deepseek_v4_router", "kimi_k26_router", "claude_fable5_router"}:
        router_key = os.environ.get("OPENROUTER_API_KEY", "")
        if not router_key or "CHANGE_ME" in router_key:
            return {
                "provider_key": provider_key,
                "status": STATUS_ENV_PENDING,
                "ok": False,
                "error": "OPENROUTER_API_KEY ausente ou com placeholder CHANGE_ME",
                "latency_ms": 0,
                "checked_at": now_iso(),
            }

    # Verifica se a assinatura está disponível por QUALQUER caminho desta máquina
    # (CLI oficial OU script de automação). Cobre as duas máquinas.
    if provider_key in {"claude_subscription", "openai_subscription", "gemini_subscription"}:
        if provider_router.provider_status(exec_key) == "AUSENTE":
            _bin = {"claude_subscription": "claude", "openai_subscription": "codex",
                    "gemini_subscription": "gemini"}[provider_key]
            return {
                "provider_key": provider_key,
                "status": STATUS_ENV_PENDING,
                "ok": False,
                "error": f"Assinatura {_bin} indisponível (sem CLI no PATH nem script de automação)",
                "latency_ms": 0,
                "checked_at": now_iso(),
            }

    # Para qualquer provider de router com modelo específico (Kimi, Fable 5, etc.),
    # checa exatamente aquele modelo, sem fallbacks (evita resposta de outro modelo).
    _model_ovr = PROVIDER_MODEL_OVERRIDE.get(provider_key)
    if exec_key == "openrouter" and _model_ovr and provider_key != "deepseek_v4_router":
        original = provider_router.PROVIDER_CONFIG["openrouter"]["model"]
        original_fallback = provider_router.PROVIDER_CONFIG["openrouter"].get("fallback_models", [])
        provider_router.PROVIDER_CONFIG["openrouter"]["model"] = _model_ovr
        provider_router.PROVIDER_CONFIG["openrouter"]["fallback_models"] = []
    else:
        original = original_fallback = None

    start = time.perf_counter()
    try:
        result = provider_router.execute_llm(exec_key, prompt, max_tokens=max_tokens)
    except Exception as e:
        result = {
            "ok": False,
            "error": f"FAILED_CODE: {type(e).__name__}: {e}",
            "model": None,
            "response": None,
        }
    finally:
        if exec_key == "openrouter" and _model_ovr and provider_key != "deepseek_v4_router":
            provider_router.PROVIDER_CONFIG["openrouter"]["model"] = original
            provider_router.PROVIDER_CONFIG["openrouter"]["fallback_models"] = original_fallback

    elapsed_ms = int((time.perf_counter() - start) * 1000)
    return {
        "provider_key": provider_key,
        "status": status_from_result(provider_key, result),
        "ok": bool(result.get("ok")),
        "model": result.get("model"),
        "response_excerpt": (result.get("response") or "")[:180],
        "error": result.get("error"),
        "latency_ms": elapsed_ms,
        "checked_at": now_iso(),
    }

