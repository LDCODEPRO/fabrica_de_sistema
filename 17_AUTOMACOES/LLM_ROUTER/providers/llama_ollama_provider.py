"""llama_ollama_provider.py — Adapter para Llama via Ollama (fallback local)."""
import json
import urllib.request
from typing import Optional

BASE_URL = "http://127.0.0.1:11434"
DEFAULT_MODEL = "llama3.2:latest"
LIGHT_MODEL = "llama3.2:latest"


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
            has_llama = any("llama3.2" in m or "llama3" in m for m in models)
            return {
                "provider": "ollama_local",
                "status": "active_real" if has_llama else "unavailable",
                "available_models": [m for m in models if "llama" in m],
                "note": "Instalar com: ollama pull llama3.2:latest" if not has_llama else "",
            }
    except Exception as e:
        return {"provider": "ollama_local", "status": "unavailable", "error": str(e)}
