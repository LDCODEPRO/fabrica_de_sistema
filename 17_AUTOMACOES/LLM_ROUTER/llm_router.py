"""
llm_router.py — Roteador oficial de LLMs da Fábrica de Sistemas.

Seleciona o provider correto conforme hierarquia oficial,
respeitando billing_guard e secret_guard.
"""
import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Any

from billing_guard import check_before_call, record_cost
from cost_zero_policy import PAID_API, SUBSCRIPTION, LOCAL, incremental_cost
from secret_guard import safe_log, validate_no_secrets

logger = logging.getLogger(__name__)

REGISTRY_PATH = Path(__file__).parent / "provider_registry.json"


def _load_local_env() -> None:
    """Carrega o .env da raiz sem expor ou sobrescrever segredos."""
    env_path = Path(__file__).resolve().parents[2] / ".env"
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


def _load_registry() -> dict:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def _get_provider_chain(task_type: str) -> list[str]:
    registry = _load_registry()
    return registry.get("routing_table", {}).get(task_type, registry["routing_table"]["fallback"])


def _get_provider_config(provider_id: str) -> Optional[dict]:
    registry = _load_registry()
    return registry["providers"].get(provider_id)


def _estimate_cost(provider: dict, tokens: int) -> Optional[float]:
    return incremental_cost(provider, tokens)


class LLMRouterResult:
    def __init__(
        self,
        success: bool,
        provider_id: str,
        model: str,
        response: Any,
        mission_id: str,
        fallback_used: bool = False,
        reason: str = "",
    ):
        self.success = success
        self.provider_id = provider_id
        self.model = model
        self.response = response
        self.mission_id = mission_id
        self.fallback_used = fallback_used
        self.reason = reason
        self.timestamp = datetime.utcnow().isoformat()

    def to_audit_entry(self) -> dict:
        return validate_no_secrets({
            "timestamp": self.timestamp,
            "mission_id": self.mission_id,
            "provider": self.provider_id,
            "model": self.model,
            "success": self.success,
            "fallback_used": self.fallback_used,
            "reason": self.reason,
            "secrets_exposed": False,
        })


class LLMRouter:
    """
    Roteador principal. Seleciona provider conforme hierarquia oficial,
    aplica billing_guard e secret_guard em cada hop.
    """

    def __init__(self, mission_id: str):
        self.mission_id = mission_id
        self.registry = _load_registry()

    def route(
        self,
        task_type: str,
        prompt: str,
        estimated_tokens: int = 1000,
        require_vision: bool = False,
        force_local: bool = False,
        execution_mode: str = "assisted",
        director_approved: bool = False,
    ) -> LLMRouterResult:
        """
        Roteia a tarefa para o provider adequado.
        Tenta cada provider na hierarquia até encontrar um disponível.
        """
        if force_local or execution_mode == "automation":
            chain = _get_provider_chain("automation")
        elif execution_mode == "assisted":
            chain = _get_provider_chain(task_type)
        else:
            chain = _get_provider_chain(task_type)

        for provider_id in chain:
            provider = _get_provider_config(provider_id)
            if not provider:
                continue

            # Filtra por capacidade de visão se necessário
            if require_vision and not provider.get("supports_vision", False):
                continue

            provider_type = provider.get("provider_type")
            is_local = provider_type == LOCAL or provider.get("local", False)
            health_status = provider.get("health_status", "unknown")

            if execution_mode == "automation" and provider_type == SUBSCRIPTION:
                logger.info("ASSISTED_ONLY_SKIP provider=%s", provider_id)
                continue

            if provider_type in {LOCAL, PAID_API} and health_status != "active_real":
                logger.warning("HEALTH_BLOCK provider=%s health=%s", provider_id, health_status)
                continue

            if provider_type == SUBSCRIPTION and provider.get("automation_mode") == "assisted":
                return LLMRouterResult(
                    success=False,
                    provider_id=provider_id,
                    model=provider.get("model_id", "assisted"),
                    response=None,
                    mission_id=self.mission_id,
                    reason="ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE",
                )

            est_cost = _estimate_cost(provider, estimated_tokens)

            billing = check_before_call(
                mission_id=self.mission_id,
                provider=provider_id,
                estimated_cost=est_cost,
                is_local=is_local,
                provider_type=provider_type,
                director_approved=director_approved,
                secret_guard_ok=True,
                provider_health=health_status,
            )

            if not billing:
                logger.warning(
                    "BILLING_BLOCK provider=%s reason=%s → tentando próximo",
                    provider_id, billing.reason
                )
                continue

            # Verificar credencial
            env_var = provider.get("env_var")
            if env_var and not os.environ.get(env_var):
                logger.warning(
                    "CONFIG_REQUIRED provider=%s env_var=%s → tentando próximo",
                    provider_id, env_var
                )
                continue

            # Provider disponível — executar via adapter
            try:
                result = self._call_provider(provider_id, provider, prompt)
                fallback = provider_id != chain[0]

                logger.info(
                    "LLM_ROUTER OK mission=%s provider=%s model=%s fallback=%s",
                    self.mission_id, provider_id, provider["model_id"], fallback
                )

                if provider_type == PAID_API and est_cost and est_cost > 0:
                    record_cost(self.mission_id, est_cost, provider_id)

                return LLMRouterResult(
                    success=True,
                    provider_id=provider_id,
                    model=provider["model_id"],
                    response=result,
                    mission_id=self.mission_id,
                    fallback_used=fallback,
                    reason="OK",
                )

            except Exception as e:
                safe_log("warning", f"PROVIDER_FAILED provider={provider_id} error={e} → tentando próximo")
                continue

        logger.error(
            "LLM_ROUTER EXHAUSTED mission=%s task=%s — todos providers falharam",
            self.mission_id, task_type
        )
        return LLMRouterResult(
            success=False,
            provider_id="none",
            model="none",
            response=None,
            mission_id=self.mission_id,
            reason="ALL_PROVIDERS_FAILED",
        )

    def _call_provider(self, provider_id: str, provider: dict, prompt: str) -> str:
        """Despacha para o adapter correto."""
        adapters = {
            "deepseek_api": "_call_openai_compatible",
            "openai_api":   "_call_openai_compatible",
            "openrouter_api": "_call_openai_compatible",
            "claude_api": "_call_anthropic",
            "gemini_api":   "_call_gemini",
            "ollama_local":   "_call_ollama",
        }
        method_name = adapters.get(provider_id)
        if not method_name:
            raise ValueError(f"Adapter não encontrado para provider={provider_id}")
        return getattr(self, method_name)(provider, prompt)

    def _call_openai_compatible(self, provider: dict, prompt: str) -> str:
        import urllib.request
        import urllib.error
        api_key = os.environ.get(provider["env_var"], "")
        base_url = provider['base_url']
        endpoint = f"{base_url}/chat/completions" if base_url.endswith("/v1") else f"{base_url}/v1/chat/completions"
        models = [provider["model_id"], *provider.get("fallback_model_ids", [])]
        errors = []
        for model in models:
            payload = json.dumps({
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1024,
            }).encode("utf-8")
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                method="POST",
            )
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = json.loads(resp.read())
                    return data["choices"][0]["message"]["content"]
            except urllib.error.HTTPError as exc:
                errors.append(f"{model}:HTTP_{exc.code}")
        raise RuntimeError("Nenhum modelo OpenRouter respondeu: " + ", ".join(errors))

    def _call_anthropic(self, provider: dict, prompt: str) -> str:
        try:
            import anthropic
            api_key = os.environ.get(provider.get("env_var", ""), "")
            client = anthropic.Anthropic(api_key=api_key) if api_key else anthropic.Anthropic()
            msg = client.messages.create(
                model=provider["model_id"],
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            return msg.content[0].text
        except ImportError:
            raise RuntimeError("SDK anthropic não instalado")

    def _call_gemini(self, provider: dict, prompt: str) -> str:
        import urllib.request
        api_key = os.environ.get(provider["env_var"], "")
        model = provider["model_id"]
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _call_ollama(self, provider: dict, prompt: str) -> str:
        import urllib.request
        payload = json.dumps({
            "model": provider["model_id"],
            "prompt": prompt,
            "stream": False,
        }).encode("utf-8")
        req = urllib.request.Request(
            f"{provider['base_url']}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
            return data.get("response", "")
