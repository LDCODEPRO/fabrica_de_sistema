"""deepseek_provider.py — Adapter para DeepSeek V4 Pro (motor principal)."""
import os
import json
import urllib.request
from typing import Optional

BASE_URL = "https://api.deepseek.com"
DEFAULT_MODEL = "deepseek-chat"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY não configurada — status: API_KEY_REQUIRED")

    payload = json.dumps({
        "model": model or DEFAULT_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{BASE_URL}/v1/chat/completions",
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
    """Verifica disponibilidade sem fazer chamada LLM."""
    has_key = bool(os.environ.get("DEEPSEEK_API_KEY", ""))
    return {
        "provider": "deepseek",
        "status": "ACTIVE_REAL" if has_key else "API_KEY_REQUIRED",
        "env_var_present": has_key,
    }
