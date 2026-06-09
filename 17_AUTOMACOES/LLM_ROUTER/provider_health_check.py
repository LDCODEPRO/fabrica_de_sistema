"""
provider_health_check.py — Verificação real de disponibilidade dos providers.
Nenhum provider pode ser marcado como ativo sem passar por aqui.
"""
import os
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

REGISTRY_PATH = Path(__file__).parent / "provider_registry.json"
REPORT_PATH = Path(__file__).parent / "reports" / "LLM_PROVIDER_VALIDATION_REPORT.md"

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    import provider_router as pr
except ImportError:
    pr = None

MAP_TO_ROUTER = {
    "gemini_advanced": "gemini_sub",
    "ollama_local": "ollama",
    "openai_api": "openai",
    "claude_api": "claude",
    "gemini_api": "gemini",
    "openrouter_api": "openrouter",
    "deepseek_api": "deepseek",
}


def _load_registry() -> dict:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def _save_registry(registry: dict) -> None:
    REGISTRY_PATH.write_text(json.dumps(registry, indent=2, ensure_ascii=False), encoding="utf-8")


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
    Executa chamadas de teste real para validar a resposta do provider.
    """
    registry = _load_registry()
    provider = registry["providers"].get(provider_id)

    if not provider:
        return {"provider": provider_id, "status": "FAILED_VALIDATION", "reason": "NOT_IN_REGISTRY"}

    result = {
        "provider": provider_id,
        "name": provider.get("display_name", provider.get("name", provider_id)),
        "checked_at": datetime.utcnow().isoformat(),
        "is_local": provider.get("provider_type") == "local" or provider.get("local", False),
        "env_var": provider.get("env_var"),
        "status": "FAILED_VALIDATION",
        "reason": "",
    }

    # Se for uma assinatura assistida (automation_mode == "assisted"), não testar via API/CLI direta
    if provider.get("provider_type") == "subscription" and provider.get("automation_mode") == "assisted":
        result["status"] = "unknown"
        result["reason"] = "Assinatura/interface exige validação humana ou conector real; sem health automático nesta execução"
        return result

    # Provider local (Ollama)
    if provider.get("provider_type") == "local" or provider.get("local"):
        ok, msg = _check_ollama(provider["base_url"], provider["model_id"])
        result["status"] = "active_real" if ok else "unavailable"
        result["reason"] = msg
        return result

    # Se exigir chave, verifica se ela existe
    if provider.get("requires_api_key") or provider.get("env_var"):
        has_key = _check_env_var(provider.get("env_var"))
        if not has_key:
            result["status"] = "missing_key"
            result["reason"] = f"Variável {provider.get('env_var')} não configurada"
            return result

    # Para providers diretos ou APIs pagas, executar a chamada real se o roteador estiver disponível
    router_id = MAP_TO_ROUTER.get(provider_id)
    if router_id and pr:
        try:
            # Teste rápido e barato
            res = pr.execute_llm(
                provider=router_id,
                prompt="Responda apenas com a palavra SUCESSO.",
                system="Teste de health check. Seja extremamente conciso.",
                max_tokens=10
            )
            if res.get("ok"):
                result["status"] = "active_real"
                result["reason"] = f"Health check OK. Resposta: {res.get('response', '').strip()}"
            else:
                result["status"] = "unavailable"
                result["reason"] = f"Chamada real falhou: {res.get('error')}"
        except Exception as e:
            result["status"] = "unavailable"
            result["reason"] = f"Erro no health check real: {type(e).__name__}: {e}"
        return result

    result["status"] = "unknown"
    result["reason"] = "Credencial detectada, mas chamada real nao executada"
    return result


def check_all_providers() -> list[dict]:
    registry = _load_registry()
    results = []
    for provider_id in list(registry["providers"].keys()):
        r = check_provider(provider_id)
        status_icon = "✅" if r["status"] == "active_real" else "⚠️"
        logger.info("%s %s → %s", status_icon, r["name"], r["status"])
        results.append(r)

        # Atualiza no registry em memória
        registry["providers"][provider_id]["health_status"] = r["status"]
        registry["providers"][provider_id]["last_health_check"] = r["checked_at"]
        registry["providers"][provider_id]["notes"] = r["reason"]

    _save_registry(registry)
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
        icon = "✅" if r["status"] == "active_real" else "❌"
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
    try:
        print(report)
    except UnicodeEncodeError:
        try:
            print(report.encode("utf-8", errors="replace").decode(sys.stdout.encoding or "utf-8", errors="replace"))
        except Exception:
            print("Relatório gerado em: " + str(REPORT_PATH))
