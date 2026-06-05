"""openai_api_provider.py — Adapter para OpenAI GPT via API."""
import os
import json
import urllib.request
from typing import Optional

BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_MODEL_PRO = "gpt-4o"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY não configurada — status: API_KEY_REQUIRED")

    payload = json.dumps({
        "model": model or DEFAULT_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{BASE_URL}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
        return data["choices"][0]["message"]["content"]


def health_check() -> dict:
    has_key = bool(os.environ.get("OPENAI_API_KEY", ""))
    return {
        "provider": "openai_api",
        "status": "unknown" if has_key else "missing_key",
        "env_var_present": has_key,
        "note": "Credencial detectada, mas sem chamada real de health; nao marcar active_real apenas por chave." if has_key else "",
    }
