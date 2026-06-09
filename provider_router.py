"""
provider_router.py — Roteador real de LLM da FORJA OS.

execute_llm(provider, prompt, system=None, max_tokens=500) -> dict
execute_with_fallback(prompt, system=None, max_tokens=500, order=None) -> dict

REGRAS:
- Chamadas HTTP REAIS (urllib, sem deps externas).
- NUNCA loga/retorna API keys.
- Sem simulação: se nao houver chave/serviço, retorna ok=False com erro real.
- OpenAI e Claude usam assinatura; Gemini usa assinatura assistida.
- Ollama e local/gratuito. Demais modelos usam OpenRouter mediante autorização.
"""
import os
import re
import json
import shutil
import subprocess
import urllib.request
import urllib.error
from pathlib import Path


def _load_local_env():
    """Carrega o .env local sem sobrescrever variáveis já definidas."""
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


_load_local_env()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
REGISTRY_PATH = Path(__file__).resolve().parent / "17_AUTOMACOES" / "LLM_ROUTER" / "provider_registry.json"


def _is_provider_healthy(provider_id: str) -> bool:
    """Verifica se o provider está saudável no registry antes de rodar (evita timeouts pesados)."""
    map_to_registry = {
        "claude_sub": "claude_pro",
        "codex_sub": "chatgpt_plus",
        "gemini_sub": "gemini_advanced",
        "ollama": "ollama_local",
        "openai": "openai_api",
        "claude": "claude_api",
        "gemini": "gemini_api",
        "openrouter": "openrouter_api",
        "deepseek": "deepseek_api"
    }
    registry_id = map_to_registry.get(provider_id)
    if not registry_id:
        return True
    try:
        if REGISTRY_PATH.exists():
            data = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
            p = data.get("providers", {}).get(registry_id, {})
            status = p.get("health_status", "unknown")
            if status in {"unavailable", "missing_key", "offline"}:
                return False
    except Exception:
        pass
    return True


# ORDEM OFICIAL: SÓ ASSINATURAS (CLIs oficiais que autenticam pelo login da
# assinatura, como o Claude Code/Codex fazem — sem API key, sem navegador).
# 1. Claude (assinatura, CLI `claude`)
# 2. Gemini (assinatura, CLI oficial `gemini`)
# 3. ChatGPT/Codex (assinatura, CLI `codex`)
# 4. Ollama local (último recurso grátis)
PREFERRED_ORDER = ["claude_sub", "gemini_sub", "codex_sub", "openrouter", "ollama"]

GROUP_ORDERS = {
    # OpenRouter (gateway autorizado, active_real) vem logo após o Claude para
    # servir de fallback confiável ANTES das automações de navegador (gemini/codex),
    # que são intermitentes. Zero Ghost: nada de erro de automação virar "resposta".
    "conversation": ["claude_sub", "openrouter", "gemini_sub", "codex_sub", "ollama"],
    "engineering": ["claude_sub", "gemini_sub", "codex_sub", "openrouter", "ollama"],
    "low_cost": ["gemini_sub", "openrouter", "ollama", "claude_sub", "codex_sub"],
}

# Providers de ASSINATURA via CLI oficial (custo incremental R$ 0, sem API key)
SUBSCRIPTION_CLIS = {
    "claude_sub": {"bin": "claude", "label": "Claude (assinatura)"},
    "codex_sub":  {"bin": "codex",  "label": "ChatGPT/Codex (assinatura)"},
    "gemini_sub": {"bin": "gemini", "label": "Gemini (assinatura)"},
}

PROVIDER_CONFIG = {
    # Assinaturas via CLI/Browser Scripts (usam a sessão do usuário no Chrome)
    "claude_sub": {"env": None, "model": "claude-subscription", "cli": "claude"},
    "codex_sub":  {"env": None, "model": "chatgpt-subscription", "python_script": r"C:\Users\Servdia\.gemini\config\plugins\openai-integration\scripts\openai_cli.py"},
    "gemini_sub": {"env": None, "model": "gemini-subscription", "python_script": r"C:\Users\Servdia\.gemini\config\plugins\gemini-advanced\scripts\gemini_cli.py"},
    # Local grátis
    "ollama":   {"env": None, "model": os.getenv("OLLAMA_MODEL", "llama3.2:latest")},
    # APIs diretas legadas (NÃO usadas por padrão — assinaturas têm prioridade)
    "deepseek": {"env": "DEEPSEEK_API_KEY", "model": "deepseek-chat",
                 "url": "https://api.deepseek.com/v1/chat/completions"},
    "gemini":   {"env": "GOOGLE_API_KEY", "model": "gemini-2.5-flash"},
    "openai":   {"env": "OPENAI_API_KEY", "model": "gpt-4o-mini",
                 "url": "https://api.openai.com/v1/chat/completions"},
    # Gateway autorizado para modelos sem assinatura/local.
    "openrouter": {"env": "OPENROUTER_API_KEY",
                   "model": os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat"),
                   "fallback_models": ["moonshotai/kimi-k2.6"],
                   "url": "https://openrouter.ai/api/v1/chat/completions"},
    "claude":   {"env": "ANTHROPIC_API_KEY", "model": "claude-haiku-4-5-20251001",
                 "url": "https://api.anthropic.com/v1/messages"},
}


def _resolve_bin(bin_name):
    """Resolve caminho do executável (Windows: .cmd/.exe via PATHEXT)."""
    if bin_name == "gemini":
        portable = Path(__file__).resolve().parent / ".tools" / "gemini" / "node_modules" / ".bin" / "gemini.cmd"
        if portable.exists():
            return str(portable)
    return (shutil.which(bin_name)
            or shutil.which(bin_name + ".cmd")
            or shutil.which(bin_name + ".exe")
            or bin_name)


def _cli_available(bin_name):
    if bin_name == "gemini":
        portable = Path(__file__).resolve().parent / ".tools" / "gemini" / "node_modules" / ".bin" / "gemini.cmd"
        if portable.exists():
            return True
    return (shutil.which(bin_name) or shutil.which(bin_name + ".cmd")
            or shutil.which(bin_name + ".exe")) is not None


def _claude_cli(cfg, prompt, system, max_tokens):
    # O prompt vai por STDIN (não por -p) porque um --system-prompt longo/multi-linha
    # quebra o parser do CLI ("Input must be provided ... when using --print").
    # System e prompt são combinados num único bloco entregue via stdin.
    full = (system.strip() + "\n\n" + prompt) if system else prompt
    args = [_resolve_bin("claude"), "--tools", "None", "--print"]

    proc = subprocess.run(
        args,
        input=full,
        capture_output=True, text=True, encoding='utf-8', errors='replace',
        timeout=90,
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
    """ChatGPT via assinatura (browser automation)."""
    full = (system + "\n\n" + prompt) if system else prompt
    script = cfg["python_script"]
    proc = subprocess.run(
        ["python", script, full],
        capture_output=True, text=True, timeout=50, encoding='utf-8', errors='replace'
    )
    raw = (proc.stdout or "")
    if proc.returncode != 0 and not raw.strip():
        raise RuntimeError(((proc.stderr or "").strip() or "openai_cli falhou")[:160])
    if _looks_like_cli_error(raw):
        first = (raw.strip().splitlines() or ["codex CLI sem resposta válida"])[0]
        raise RuntimeError(("CLI_AUTOMATION_ERROR: " + first)[:160])
    return raw.strip()


def _gemini_cli(cfg, prompt, system, max_tokens):
    """Gemini via assinatura Google One (browser automation)."""
    full = (system + "\n\n" + prompt) if system else prompt
    script = cfg["python_script"]
    proc = subprocess.run(
        ["python", script, full],
        capture_output=True, text=True, timeout=50, encoding='utf-8', errors='replace'
    )
    raw = (proc.stdout or "").strip()
    err = (proc.stderr or "").strip()
    if proc.returncode != 0 or not raw:
        raise RuntimeError((err or raw or "gemini_cli sem saída")[:160])
    if _looks_like_cli_error(raw):
        first = (raw.splitlines() or ["gemini CLI sem resposta válida"])[0]
        raise RuntimeError(("CLI_AUTOMATION_ERROR: " + first)[:160])
    return raw


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


# Marcadores de erro de automação de navegador (Playwright/CLI). Quando o script
# de assinatura imprime um destes em stdout com returncode 0, NÃO é uma resposta
# do modelo — é uma falha. Tratá-la como sucesso violaria a Zero Ghost Law.
_CLI_ERROR_MARKERS = (
    "Traceback (most recent call last)",
    "Locator.",
    "ms exceeded",
    "Timeout exceeded",
    "playwright._impl",
    "Execution context was destroyed",
    "net::ERR_",
    "TimeoutError",
)


def _looks_like_cli_error(text):
    """True se a saída do CLI for, na verdade, uma mensagem de erro (não resposta)."""
    if not text or not text.strip():
        return True
    head = text.strip()
    if head.startswith(("ERRO", "Erro:", "Error:", "Traceback")):
        return True
    return any(mk in text for mk in _CLI_ERROR_MARKERS)


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
    if cfg.get("python_script"):
        return "CONFIGURADO" if os.path.exists(cfg["python_script"]) else "AUSENTE"
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


def _openrouter(cfg, prompt, system, max_tokens):
    """OpenRouter com ordem oficial de modelos e fallback explícito."""
    key = os.environ.get(cfg["env"], "")
    if not key:
        raise RuntimeError(f"{cfg['env']} ausente")
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    errors = []
    models = [cfg["model"], *cfg.get("fallback_models", [])]
    for model in models:
        try:
            out = _post(
                cfg["url"],
                {"model": model, "messages": messages, "max_tokens": max_tokens},
                {"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            )
            content = out["choices"][0]["message"].get("content") or ""
            if not content.strip():
                errors.append(f"{model}:EMPTY_RESPONSE")
                continue
            return content, model
        except urllib.error.HTTPError as exc:
            errors.append(f"{model}:HTTP_{exc.code}")
        except Exception as exc:
            errors.append(f"{model}:{type(exc).__name__}")
    raise RuntimeError("OpenRouter sem modelo disponível: " + ", ".join(errors))


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
    "gemini_sub": _gemini_cli,   # assinatura Google (Gemini CLI)
    "ollama": _ollama,
    # APIs pagas (não usadas por padrão)
    "deepseek": _openai_compatible,
    "openai": _openai_compatible,
    "openrouter": _openrouter,
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
        output = fn(cfg, prompt, system, max_tokens)
        if isinstance(output, tuple):
            text, actual_model = output
            result["model"] = actual_model
        else:
            text = output
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
        if not _is_provider_healthy(prov):
            trail.append({"provider": prov, "skipped": "HEALTH_UNHEALTHY_IN_REGISTRY"})
            continue
        r = execute_llm(prov, prompt, system, max_tokens)
        trail.append({"provider": prov, "ok": r["ok"], "error": r["error"]})
        if r["ok"]:
            r["fallback_trail"] = trail
            return r
    return {"ok": False, "provider": None, "model": None, "response": None,
            "tokens_estimated": 0, "error": "todos os providers falharam",
            "fallback_trail": trail}


def execute_for_group(group, prompt, system=None, max_tokens=500):
    """Executa pela ordem oficial do grupo operacional."""
    return execute_with_fallback(
        prompt,
        system=system,
        max_tokens=max_tokens,
        order=GROUP_ORDERS.get(group, PREFERRED_ORDER),
    )


if __name__ == "__main__":
    print("=== Status dos providers (sem expor chaves) ===")
    for p in PREFERRED_ORDER:
        print(f"  {p}: {provider_status(p)}")
