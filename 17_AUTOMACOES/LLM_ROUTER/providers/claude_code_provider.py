"""claude_code_provider.py — Adapter para Claude Code (assinatura oficial)."""
import subprocess
import tempfile
import os
from typing import Optional


def call(prompt: str, model: Optional[str] = None, max_tokens: int = 2048) -> str:
    """
    Invoca Claude Code via CLI.
    Requer assinatura ativa do Claude Code.
    """
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False, encoding="utf-8") as f:
        f.write(prompt)
        tmp_path = f.name

    try:
        result = subprocess.run(
            ["claude", "-p", prompt, "--output-format", "text"],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            return result.stdout.strip()
        raise RuntimeError(f"Claude Code CLI error: {result.stderr[:200]}")
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


def health_check() -> dict:
    """Verifica se Claude Code CLI está instalado e acessível."""
    try:
        result = subprocess.run(
            ["claude", "--version"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            return {
                "provider": "claude_code",
                "status": "unknown",
                "version": result.stdout.strip(),
                "note": "CLI detectado, mas resposta real nao foi executada nesta verificacao.",
            }
        return {"provider": "claude_code", "status": "FAILED_VALIDATION", "error": result.stderr}
    except FileNotFoundError:
        return {"provider": "claude_code", "status": "CONFIG_REQUIRED", "note": "Claude Code CLI não encontrado"}
    except Exception as e:
        return {"provider": "claude_code", "status": "TEMPORARILY_UNAVAILABLE", "error": str(e)}
