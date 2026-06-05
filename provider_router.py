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
import re
import json
import shutil
import subprocess
import urllib.request
import urllib.error

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")

# ORDEM OFICIAL: SÓ ASSINATURAS (CLIs oficiais que autenticam pelo login da
# assinatura, como o Claude Code/Codex fazem — sem API key, sem navegador).
# 1. Claude (assinatura, CLI `claude`)
# 2. ChatGPT/Codex (assinatura, CLI `codex`)
# 3. Ollama local (último recurso grátis)
PREFERRED_ORDER = ["claude_sub", "codex_sub", "ollama"]

# Providers de ASSINATURA via CLI oficial (custo incremental R$ 0, sem API key)
SUBSCRIPTION_CLIS = {
    "claude_sub": {"bin": "claude", "label": "Claude (assinatura)"},
    "codex_sub":  {"bin": "codex",  "label": "ChatGPT/Codex (assinatura)"},
}

PROVIDER_CONFIG = {
    # Assinaturas via CLI (sem env/url — usam o login da própria CLI)
    "claude_sub": {"env": None, "model": "claude-subscription", "cli": "claude"},
    "codex_sub":  {"env": None, "model": "chatgpt-subscription", "cli": "codex"},
    # Local grátis
    "ollama":   {"env": None, "model": os.getenv("OLLAMA_MODEL", "llama3.2:latest")},
    # APIs pagas (NÃO usadas por padrão — só referência, bloqueadas)
    "deepseek": {"env": "DEEPSEEK_API_KEY", "model": "deepseek-chat",
                 "url": "https://api.deepseek.com/v1/chat/completions"},
    "gemini":   {"env": "GOOGLE_API_KEY", "model": "gemini-2.5-flash"},
    "openai":   {"env": "OPENAI_API_KEY", "model": "gpt-4o-mini",
                 "url": "https://api.openai.com/v1/chat/completions"},
    "claude":   {"env": "ANTHROPIC_API_KEY", "model": "claude-haiku-4-5-20251001",
                 "url": "https://api.anthropic.com/v1/messages"},
}


def _resolve_bin(bin_name):
    """Resolve caminho do executável (Windows: .cmd/.exe via PATHEXT)."""
    return (shutil.which(bin_name)
            or shutil.which(bin_name + ".cmd")
            or shutil.which(bin_name + ".exe")
            or bin_name)


def _cli_available(bin_name):
    return (shutil.which(bin_name) or shutil.which(bin_name + ".cmd")
            or shutil.which(bin_name + ".exe")) is not None


def _claude_cli(cfg, prompt, system, max_tokens):
    """Claude via assinatura (CLI oficial). Sem API key."""
    full = (system + "\n\n" + prompt) if system else prompt
    proc = subprocess.run(
        [_resolve_bin("claude"), "-p", full, "--output-format", "text"],
        capture_output=True, text=True, timeout=120,
    )
    out = (proc.stdout or "").strip()
    err = (proc.stderr or "").strip()
    if proc.returncode != 0 or not out:
        # Mensagem real (ex.: org desabilitou assinatura headless)
        raise RuntimeError((err or out or "claude CLI sem saída")[:160])
    if "disabled Claude subscription" in out or "disabled Claude subscription" in err:
        raise RuntimeError("assinatura Claude headless desabilitada pela organização")
    return out


def _codex_cli(cfg, prompt, system, max_tokens):
    """ChatGPT via assinatura (Codex CLI). Sem API key."""
    full = (system + "\n\n" + prompt) if system else prompt
    proc = subprocess.run(
        [_resolve_bin("codex"), "exec", full],
        capture_output=True, text=True, timeout=180,
    )
    raw = (proc.stdout or "")
    if proc.returncode != 0 and not raw.strip():
        raise RuntimeError(((proc.stderr or "").strip() or "codex CLI falhou")[:160])
    return _parse_codex_output(raw)


def _parse_codex_output(raw):
    """Extrai a resposta do agente do output do `codex exec`."""
    lines = raw.splitlines()
    # A resposta fica após a linha marcador 'codex' e antes de 'tokens used'
    resp = []
    capture = False
    for ln in lines:
        s = ln.strip()
        if s == "codex":
            capture = True
            continue
        if s.startswith("tokens used"):
            break
        if capture:
            resp.append(ln)
    text = "\n".join(resp).strip()
    if text:
        return text
    # fallback: remove linhas de metadados e devolve o resto
    cleaned = [l for l in lines if l.strip() and not l.strip().startswith(("---", "user", "tokens used"))]
    return "\n".join(cleaned).strip()


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
    # Assinatura via CLI: CONFIGURADO se a CLI estiver instalada
    if cfg.get("cli"):
        return "CONFIGURADO" if _cli_available(cfg["cli"]) else "AUSENTE"
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
    "claude_sub": _claude_cli,   # assinatura Claude (CLI)
    "codex_sub": _codex_cli,     # assinatura ChatGPT (Codex CLI)
    "ollama": _ollama,
    # APIs pagas (não usadas por padrão)
    "deepseek": _openai_compatible,
    "openai": _openai_compatible,
    "gemini": _gemini,
    "claude": _claude,
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
