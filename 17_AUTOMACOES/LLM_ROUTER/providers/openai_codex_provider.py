"""openai_codex_provider.py — Adapter para OpenAI Codex via assinatura."""
import os
import json
import urllib.request
from typing import Optional

BASE_URL = "https://api.openai.com/v1"
CODEX_MODEL = "gpt-4o"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 4096) -> str:
    """
    Usa GPT-4o como motor de código (equivalente Codex).
    Requer OPENAI_API_KEY ou assinatura ChatGPT Plus ativa.
    """
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY não configurada — use assinatura ChatGPT Plus")

    payload = json.dumps({
        "model": model or CODEX_MODEL,
        "messages": [
            {"role": "system", "content": "You are an expert software engineer. Generate clean, production-ready code."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.1,
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
        "provider": "openai_codex",
        "status": "ACTIVE_REAL" if has_key else "API_KEY_REQUIRED",
        "model": CODEX_MODEL,
    }
