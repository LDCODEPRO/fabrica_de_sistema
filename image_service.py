"""
image_service.py — Geração de imagem da FORJA OS com cadeia de fallback real.

Ordem (custo primeiro):
1. gemini  — GOOGLE_API_KEY (free tier; quota diária — quando esgota, cai pro próximo)
2. openai  — OPENAI_API_KEY (gpt-image-1; pago barato, testado ok)
3. openrouter — OPENROUTER_API_KEY (modelo de imagem; precisa de créditos)

generate_image(prompt) -> (bytes_png_ou_jpg, provider_usado)
Levanta RuntimeError com a trilha de erros se todos falharem.
Sem simulação (Zero Ghost): erro real ou imagem real.
"""
import os
import json
import base64
import urllib.request
import urllib.error
from pathlib import Path


def _load_env():
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


_load_env()


def _post_json(url, payload, headers, timeout=180):
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"),
                                 headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read())


def _gemini(prompt):
    key = os.environ.get("GOOGLE_API_KEY", "")
    if not key:
        raise RuntimeError("GOOGLE_API_KEY ausente")
    model = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
    out = _post_json(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}",
        {"contents": [{"parts": [{"text": prompt}]}],
         "generationConfig": {"responseModalities": ["IMAGE"]}},
        {"Content-Type": "application/json"})
    parts = out.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    inline = next((p["inlineData"] for p in parts if "inlineData" in p), None)
    if not inline:
        raise RuntimeError("gemini não retornou imagem")
    return base64.b64decode(inline["data"])


def _openai(prompt):
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        raise RuntimeError("OPENAI_API_KEY ausente")
    quality = os.environ.get("OPENAI_IMAGE_QUALITY", "low")  # low|medium|high
    out = _post_json(
        "https://api.openai.com/v1/images/generations",
        {"model": "gpt-image-1", "prompt": prompt, "n": 1,
         "size": "1024x1024", "quality": quality},
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    return base64.b64decode(out["data"][0]["b64_json"])


def _openrouter(prompt):
    key = os.environ.get("OPENROUTER_API_KEY", "")
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY ausente")
    model = os.environ.get("OPENROUTER_IMAGE_MODEL", "google/gemini-2.5-flash-image")
    out = _post_json(
        "https://openrouter.ai/api/v1/chat/completions",
        {"model": model,
         "messages": [{"role": "user", "content": "Gere uma imagem, alta qualidade: " + prompt}],
         "modalities": ["image", "text"], "max_tokens": 4096},
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    imgs = out["choices"][0]["message"].get("images") or []
    if not imgs:
        raise RuntimeError("openrouter não retornou imagem")
    data_url = imgs[0]["image_url"]["url"]
    return base64.b64decode(data_url.split(",", 1)[1])


_CHAIN = [("gemini", _gemini), ("openai", _openai), ("openrouter", _openrouter)]


def generate_image(prompt):
    """Gera imagem pela cadeia. Retorna (bytes, provider). RuntimeError se todos falharem."""
    errors = []
    for name, fn in _CHAIN:
        try:
            return fn(prompt), name
        except urllib.error.HTTPError as e:
            body = ""
            try:
                body = e.read().decode("utf-8", "replace")[:120]
            except Exception:
                pass
            errors.append(f"{name}: HTTP {e.code} {body[:80]}")
        except Exception as e:
            errors.append(f"{name}: {type(e).__name__}: {str(e)[:80]}")
    raise RuntimeError("geração de imagem falhou em todos os providers — " + " | ".join(errors))
