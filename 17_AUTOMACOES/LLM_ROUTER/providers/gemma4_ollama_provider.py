"""gemma4_ollama_provider.py — Adapter para Gemma 4 via Ollama (local)."""
import json
import urllib.request
from typing import Optional

BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "gemma3:12b"
LIGHT_MODEL = "gemma3:4b"


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    payload = json.dumps({
        "model": model or DEFAULT_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"num_predict": max_tokens},
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{BASE_URL}/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
        return data.get("response", "")


def health_check() -> dict:
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            models = [m.get("name", "") for m in data.get("models", [])]
            has_gemma = any("gemma" in m for m in models)
            return {
                "provider": "gemma4",
                "status": "LOCAL_OK" if has_gemma else "CONFIG_REQUIRED",
                "available_models": [m for m in models if "gemma" in m],
                "note": "Instalar com: ollama pull gemma3:12b" if not has_gemma else "",
            }
    except Exception as e:
        return {"provider": "gemma4", "status": "TEMPORARILY_UNAVAILABLE", "error": str(e)}
