#!/usr/bin/env python3
"""
check_llm_environment.py - Script de diagnóstico para o ecossistema de LLMs.
Verifica dependências do sistema, Ollama, CLIs de assinatura e OpenRouter.
Gera os status: CERTIFIED, ENVIRONMENT_PENDING, OFFLINE, ERROR, BLOCKED_BY_BILLING.
"""

import os
import sys
import json
import shutil
import socket
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

# Status possíveis
STATUS_CERTIFIED = "CERTIFIED"
STATUS_ENV_PENDING = "ENVIRONMENT_PENDING"
STATUS_OFFLINE = "OFFLINE"
STATUS_ERROR = "ERROR"
STATUS_BLOCKED_BY_BILLING = "BLOCKED_BY_BILLING"


def load_env_vars():
    """Carrega .env e .env.llm se existirem para ler chaves e configurações."""
    root = Path(__file__).resolve().parents[1]
    for filename in [".env", ".env.llm"]:
        env_path = root / filename
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env_vars()


def check_python() -> str:
    # Python sempre roda para estar executando este script
    if sys.version_info >= (3, 8):
        return STATUS_CERTIFIED
    return STATUS_ERROR


def check_node() -> str:
    try:
        proc = subprocess.run(["node", "--version"], capture_output=True, text=True, timeout=5)
        if proc.returncode == 0 and proc.stdout.strip():
            return STATUS_CERTIFIED
    except Exception:
        pass
    return STATUS_ENV_PENDING


def check_git() -> str:
    try:
        proc = subprocess.run(["git", "--version"], capture_output=True, text=True, timeout=5)
        if proc.returncode == 0 and proc.stdout.strip():
            return STATUS_CERTIFIED
    except Exception:
        pass
    return STATUS_ENV_PENDING


def check_ollama_instalado() -> str:
    if shutil.which("ollama") or shutil.which("ollama.exe"):
        return STATUS_CERTIFIED
    return STATUS_ENV_PENDING


def check_ollama_rodando() -> str:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    try:
        req = urllib.request.Request(f"{base_url}/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                return STATUS_CERTIFIED
    except Exception:
        pass
    return STATUS_ENV_PENDING


def check_ollama_modelos() -> str:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    try:
        req = urllib.request.Request(f"{base_url}/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = data.get("models", [])
            if models:
                return STATUS_CERTIFIED
    except Exception:
        pass
    return STATUS_ENV_PENDING


def check_claude_cli() -> str:
    if shutil.which("claude") or shutil.which("claude.cmd") or shutil.which("claude.exe"):
        return STATUS_CERTIFIED
    return STATUS_ENV_PENDING


def check_claude_sessao() -> str:
    if check_claude_cli() == STATUS_ENV_PENDING:
        return STATUS_ENV_PENDING
    
    # Tenta um comando simples ou dry run no CLI para ver se está logado
    try:
        proc = subprocess.run(
            ["claude", "-p", "Responder apenas OK", "--output-format", "text"],
            capture_output=True, text=True, timeout=15
        )
        out = (proc.stdout or "").strip()
        err = (proc.stderr or "").strip()
        if "login" in out.lower() or "signin" in out.lower() or "not logged in" in out.lower() or "disabled claude subscription" in out.lower() or "disabled claude subscription" in err.lower():
            return STATUS_ENV_PENDING
        if proc.returncode == 0 and out:
            return STATUS_CERTIFIED
    except Exception:
        pass
    return STATUS_ENV_PENDING


def check_openai_cli() -> str:
    if shutil.which("codex") or shutil.which("codex.cmd") or shutil.which("codex.exe"):
        return STATUS_CERTIFIED
    return STATUS_ENV_PENDING


def check_gemini_cli() -> str:
    # Verifica tanto no PATH quanto na pasta portátil do projeto
    root = Path(__file__).resolve().parents[1]
    portable = root / ".tools" / "gemini" / "node_modules" / ".bin" / "gemini.cmd"
    if portable.exists():
        return STATUS_CERTIFIED
    if shutil.which("gemini") or shutil.which("gemini.cmd") or shutil.which("gemini.exe"):
        return STATUS_CERTIFIED
    return STATUS_ENV_PENDING


def check_openrouter_responde() -> str:
    try:
        req = urllib.request.Request("https://openrouter.ai/api/v1/models", method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                return STATUS_CERTIFIED
    except urllib.error.HTTPError as e:
        if e.code == 402 or e.code == 429:
            return STATUS_BLOCKED_BY_BILLING
        return STATUS_OFFLINE
    except Exception:
        pass
    return STATUS_OFFLINE


def check_router_model(model_name: str) -> str:
    key = os.getenv("OPENROUTER_API_KEY", "")
    if not key or "CHANGE_ME" in key:
        return STATUS_ENV_PENDING
    
    # Faz uma chamada de validação real leve com max_tokens=1
    url = "https://openrouter.ai/api/v1/chat/completions"
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": "ping"}],
        "max_tokens": 1
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", f"Bearer {key}")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            out = json.loads(resp.read().decode("utf-8"))
            if "choices" in out:
                return STATUS_CERTIFIED
            return STATUS_ERROR
    except urllib.error.HTTPError as e:
        if e.code == 402 or e.code == 429:
            return STATUS_BLOCKED_BY_BILLING
        return STATUS_OFFLINE
    except Exception:
        return STATUS_OFFLINE


def main():
    print("=== FORJA OS - DIAGNÓSTICO DO AMBIENTE LLM ===")
    
    results = {
        "Python": check_python(),
        "Node": check_node(),
        "Git": check_git(),
        "Ollama Instalado": check_ollama_instalado(),
        "Ollama Rodando": check_ollama_rodando(),
        "Modelos Ollama Disponíveis": check_ollama_modelos(),
        "Claude CLI Disponível": check_claude_cli(),
        "Claude Sessão Válida": check_claude_sessao(),
        "OpenAI/Codex CLI Disponível": check_openai_cli(),
        "Gemini CLI Disponível": check_gemini_cli(),
        "OpenRouter Responde": check_openrouter_responde(),
        "DeepSeek V4 Pro via Router": check_router_model("deepseek/deepseek-v4-pro"),
        "Kimi K2.6 via Router": check_router_model("moonshotai/kimi-k2.6")
    }

    # Print em formato de tabela legível
    print(f"{'Componente':<30} | {'Status':<25}")
    print("-" * 60)
    for name, status in results.items():
        print(f"{name:<30} | {status:<25}")
    
    print("\n=== VEREDITOS FINAIS ===")
    print(f"Ollama Local: {results['Ollama Rodando']}")
    print(f"Claude Assinatura: {results['Claude Sessão Válida']}")
    print(f"OpenAI Assinatura: {results['OpenAI/Codex CLI Disponível']}")
    print(f"Gemini Assinatura: {results['Gemini CLI Disponível']}")
    print(f"OpenRouter: {results['OpenRouter Responde']}")
    
    # Grava o status em arquivo temporário de diagnóstico se necessário
    root = Path(__file__).resolve().parents[1]
    diag_file = root / "logs" / "llm_check_status.json"
    diag_file.parent.mkdir(parents=True, exist_ok=True)
    diag_file.write_text(json.dumps(results, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
