"""
provider_router.py — Roteador real de LLM da FORJA OS.

execute_llm(provider, prompt, system=None, max_tokens=500) -> dict
execute_with_fallback(prompt, system=None, max_tokens=500, order=None) -> dict

REGRAS:
- Chamadas HTTP REAIS (urllib, sem deps externas).
- NUNCA loga/retorna API keys.
- Sem simulação: se nao houver chave/serviço, retorna ok=False com erro real.
- Ordem preferencial: DeepSeek -> Gemini -> OpenAI -> Claude -> Ollama local.
"""
import os
import json
import urllib.request
import urllib.error

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")

PREFERRED_ORDER = ["deepseek", "gemini", "openai", "claude", "ollama"]

PROVIDER_CONFIG = {
    "deepseek": {"env": "DEEPSEEK_API_KEY", "model": "deepseek-chat",
                 "url": "https://api.deepseek.com/v1/chat/completions"},
    "gemini":   {"env": "GOOGLE_API_KEY", "model": "gemini-2.5-flash"},
    "openai":   {"env": "OPENAI_API_KEY", "model": "gpt-4o-mini",
                 "url": "https://api.openai.com/v1/chat/completions"},
    "claude":   {"env": "ANTHROPIC_API_KEY", "model": "claude-haiku-4-5-20251001",
                 "url": "https://api.anthropic.com/v1/messages"},
    "ollama":   {"env": None, "model": os.getenv("OLLAMA_MODEL", "llama3.2:latest")},
}


def _post(url, payload, headers, timeout=60):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read())


def provider_status(provider):
    """CONFIGURADO / AUSENTE — nunca expõe valor."""
    cfg = PROVIDER_CONFIG.get(provider)
    if not cfg:
        return "DESCONHECIDO"
    if cfg["env"] is None:  # local
        return "CONFIGURADO"
    v = os.environ.get(cfg["env"], "")
    return "CONFIGURADO" if (v and len(v) > 8) else "AUSENTE"


def _estimate_tokens(text):
    return max(1, len(text or "") // 4)


def _openai_compatible(cfg, prompt, system, max_tokens):
    key = os.environ.get(cfg["env"], "")
    if not key:
        raise RuntimeError(f"{cfg['env']} ausente")
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    out = _post(cfg["url"], {"model": cfg["model"], "messages": messages, "max_tokens": max_tokens},
                {"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    return out["choices"][0]["message"]["content"]


def _gemini(cfg, prompt, system, max_tokens):
    key = os.environ.get(cfg["env"], "")
    if not key:
        raise RuntimeError(f"{cfg['env']} ausente")
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{cfg['model']}:generateContent?key={key}")
    parts = []
    if system:
        parts.append({"text": "System: " + system})
    parts.append({"text": prompt})
    # gemini-2.5-flash usa "thinking"; garante orçamento mínimo p/ gerar parts
    out = _post(url, {"contents": [{"parts": parts}],
                      "generationConfig": {"maxOutputTokens": max(max_tokens, 256)}},
                {"Content-Type": "application/json"})
    cands = out.get("candidates") or []
    if not cands:
        raise RuntimeError("gemini sem candidates: " + str(out.get("promptFeedback", ""))[:80])
    content = cands[0].get("content", {})
    parts_out = content.get("parts") or []
    texts = [p.get("text", "") for p in parts_out if p.get("text")]
    if not texts:
        reason = cands[0].get("finishReason", "?")
        raise RuntimeError(f"gemini sem texto (finishReason={reason})")
    return "".join(texts)


def _claude(cfg, prompt, system, max_tokens):
    key = os.environ.get(cfg["env"], "")
    if not key:
        raise RuntimeError(f"{cfg['env']} ausente")
    payload = {"model": cfg["model"], "max_tokens": max_tokens,
               "messages": [{"role": "user", "content": prompt}]}
    if system:
        payload["system"] = system
    out = _post(cfg["url"], payload,
                {"x-api-key": key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"})
    return out["content"][0]["text"]


def _ollama(cfg, prompt, system, max_tokens):
    full = (system + "\n\n" + prompt) if system else prompt
    out = _post(f"{OLLAMA_URL}/api/generate",
                {"model": cfg["model"], "prompt": full, "stream": False,
                 "options": {"num_predict": max_tokens}},
                {"Content-Type": "application/json"}, timeout=120)
    return out.get("response", "")


_DISPATCH = {
    "deepseek": _openai_compatible,
    "openai": _openai_compatible,
    "gemini": _gemini,
    "claude": _claude,
    "ollama": _ollama,
}


def execute_llm(provider, prompt, system=None, max_tokens=500):
    """Executa um provider específico. Retorno padronizado, sem expor secrets."""
    cfg = PROVIDER_CONFIG.get(provider)
    result = {"ok": False, "provider": provider, "model": None,
              "response": None, "tokens_estimated": 0, "error": None}
    if not cfg:
        result["error"] = "provider desconhecido"
        return result
    result["model"] = cfg["model"]
    try:
        fn = _DISPATCH[provider]
        text = fn(cfg, prompt, system, max_tokens)
        result["ok"] = True
        result["response"] = text
        result["tokens_estimated"] = _estimate_tokens(prompt) + _estimate_tokens(text)
    except urllib.error.HTTPError as e:
        # Nunca inclui corpo que possa conter eco de credencial
        result["error"] = f"HTTP {e.code} em {provider}"
    except Exception as e:
        result["error"] = f"{type(e).__name__}: {e}"
    return result


def execute_with_fallback(prompt, system=None, max_tokens=500, order=None):
    """Tenta providers em ordem preferencial. Retorna o primeiro OK + trilha de fallback."""
    order = order or PREFERRED_ORDER
    trail = []
    for prov in order:
        if provider_status(prov) == "AUSENTE":
            trail.append({"provider": prov, "skipped": "AUSENTE"})
            continue
        r = execute_llm(prov, prompt, system, max_tokens)
        trail.append({"provider": prov, "ok": r["ok"], "error": r["error"]})
        if r["ok"]:
            r["fallback_trail"] = trail
            return r
    return {"ok": False, "provider": None, "model": None, "response": None,
            "tokens_estimated": 0, "error": "todos os providers falharam",
            "fallback_trail": trail}


if __name__ == "__main__":
    print("=== Status dos providers (sem expor chaves) ===")
    for p in PREFERRED_ORDER:
        print(f"  {p}: {provider_status(p)}")
