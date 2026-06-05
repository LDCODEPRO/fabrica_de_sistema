"""anthropic_api_provider.py — Adapter para Anthropic Claude via API."""
import os
from typing import Optional

DEFAULT_MODEL = "claude-haiku-4-5-20251001"
DEFAULT_MODEL_PRO = "claude-sonnet-4-6"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    try:
        import anthropic
    except ImportError:
        raise RuntimeError("SDK anthropic não instalado: pip install anthropic")

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    client = anthropic.Anthropic(api_key=api_key) if api_key else anthropic.Anthropic()

    msg = client.messages.create(
        model=model or DEFAULT_MODEL,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text


def health_check() -> dict:
    has_key = bool(os.environ.get("ANTHROPIC_API_KEY", ""))
    return {
        "provider": "anthropic",
        "status": "SUBSCRIPTION_OK",
        "env_var_present": has_key,
        "note": "Claude Code CLI ativo neste ambiente",
    }
