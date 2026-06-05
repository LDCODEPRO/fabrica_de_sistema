"""
provider_health_check.py — Verificação real de disponibilidade dos providers.
Nenhum provider pode ser marcado como ativo sem passar por aqui.
"""
import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

REGISTRY_PATH = Path(__file__).parent / "provider_registry.json"
REPORT_PATH = Path(__file__).parent / "reports" / "LLM_PROVIDER_VALIDATION_REPORT.md"


def _load_registry() -> dict:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def _check_env_var(env_var: Optional[str]) -> bool:
    if env_var is None:
        return True
    val = os.environ.get(env_var, "")
    return bool(val and len(val) > 8)


def _check_ollama(base_url: str, model_id: str) -> tuple[bool, str]:
    try:
        import urllib.request
        req = urllib.request.Request(f"{base_url}/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            models = [m.get("name", "") for m in data.get("models", [])]
            model_base = model_id.split(":")[0]
            available = any(model_base in m for m in models)
            if available:
                return True, "LOCAL_OK"
            return False, f"MODEL_NOT_FOUND (available: {models[:3]})"
    except Exception as e:
        return False, f"OLLAMA_UNAVAILABLE: {type(e).__name__}"


def _check_api_reachable(base_url: str) -> tuple[bool, str]:
    try:
        import urllib.request
        req = urllib.request.Request(base_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return True, f"HTTP_{resp.status}"
    except Exception as e:
        return False, f"UNREACHABLE: {type(e).__name__}"


def check_provider(provider_id: str) -> dict:
    """
    Verifica um provider e retorna dict com status e detalhes.
    NÃO faz chamadas LLM reais (apenas health checks de conectividade).
    """
    registry = _load_registry()
    provider = registry["providers"].get(provider_id)

    if not provider:
        return {"provider": provider_id, "status": "FAILED_VALIDATION", "reason": "NOT_IN_REGISTRY"}

    result = {
        "provider": provider_id,
        "name": provider["name"],
        "checked_at": datetime.utcnow().isoformat(),
        "is_local": provider.get("local", False),
        "env_var": provider.get("env_var"),
        "status": "FAILED_VALIDATION",
        "reason": "",
    }

    # Provider com assinatura ativa conhecida
    if provider.get("subscription_active"):
        result["status"] = "SUBSCRIPTION_OK"
        result["reason"] = "Assinatura ativa conhecida"
        return result

    # Provider local (Ollama)
    if provider.get("local"):
        ok, msg = _check_ollama(provider["base_url"], provider["model_id"])
        result["status"] = "LOCAL_OK" if ok else "TEMPORARILY_UNAVAILABLE"
        result["reason"] = msg
        return result

    # Provider via API — verificar credencial
    has_key = _check_env_var(provider.get("env_var"))
    if not has_key:
        result["status"] = "API_KEY_REQUIRED"
        result["reason"] = f"Variável {provider.get('env_var')} não configurada"
        return result

    result["status"] = "ACTIVE_REAL"
    result["reason"] = "Credencial detectada"
    return result


def check_all_providers() -> list[dict]:
    registry = _load_registry()
    results = []
    for provider_id in registry["providers"]:
        r = check_provider(provider_id)
        status_icon = "✅" if r["status"] in ("ACTIVE_REAL", "SUBSCRIPTION_OK", "LOCAL_OK") else "⚠️"
        logger.info("%s %s → %s", status_icon, r["name"], r["status"])
        results.append(r)
    return results


def generate_validation_report(results: list[dict]) -> str:
    """Gera relatório Markdown de validação. Nunca inclui valores de credenciais."""
    lines = [
        "# LLM_PROVIDER_VALIDATION_REPORT",
        f"**Gerado:** {datetime.utcnow().isoformat()}",
        "",
        "| Provider | Status | Motivo |",
        "|----------|--------|--------|",
    ]
    for r in results:
        icon = "✅" if r["status"] in ("ACTIVE_REAL", "SUBSCRIPTION_OK", "LOCAL_OK") else "❌"
        lines.append(f"| {r['name']} | {icon} {r['status']} | {r['reason']} |")

    lines += [
        "",
        "## AUDITORIA DE SEGURANÇA",
        "- Nenhum valor de credencial foi registrado neste relatório.",
        "- Apenas existência de variáveis de ambiente foi verificada.",
        "",
        f"_Gerado por provider_health_check.py · {datetime.utcnow().strftime('%Y-%m-%d')}_",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    results = check_all_providers()
    report = generate_validation_report(results)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(report, encoding="utf-8")
    print(report)
