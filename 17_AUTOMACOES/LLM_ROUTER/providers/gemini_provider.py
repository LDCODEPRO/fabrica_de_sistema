"""gemini_provider.py — Adapter para Google Gemini."""
import os
import json
import urllib.request
from typing import Optional

DEFAULT_MODEL = "gemini-2.5-flash"
DEFAULT_MODEL_PRO = "gemini-2.5-pro"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    api_key = os.environ.get("GOOGLE_API_KEY", "")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY não configurada — status: API_KEY_REQUIRED")

    model_id = model or DEFAULT_MODEL
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model_id}:generateContent?key={api_key}"
    )
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": max_tokens},
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
        return data["candidates"][0]["content"]["parts"][0]["text"]


def health_check() -> dict:
    has_key = bool(os.environ.get("GOOGLE_API_KEY", ""))
    return {
        "provider": "gemini",
        "status": "ACTIVE_REAL" if has_key else "API_KEY_REQUIRED",
        "env_var_present": has_key,
    }
