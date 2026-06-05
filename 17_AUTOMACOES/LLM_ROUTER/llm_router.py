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
from secret_guard import safe_log, validate_no_secrets

logger = logging.getLogger(__name__)

REGISTRY_PATH = Path(__file__).parent / "provider_registry.json"


def _load_registry() -> dict:
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def _get_provider_chain(task_type: str) -> list[str]:
    registry = _load_registry()
    return registry.get("routing_table", {}).get(task_type, registry["routing_table"]["fallback"])


def _get_provider_config(provider_id: str) -> Optional[dict]:
    registry = _load_registry()
    return registry["providers"].get(provider_id)


def _estimate_cost(provider: dict, tokens: int) -> float:
    return (tokens / 1000) * (provider.get("cost_per_1k_input", 0) + provider.get("cost_per_1k_output", 0))


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
    ) -> LLMRouterResult:
        """
        Roteia a tarefa para o provider adequado.
        Tenta cada provider na hierarquia até encontrar um disponível.
        """
        chain = _get_provider_chain("fallback" if force_local else task_type)

        for provider_id in chain:
            provider = _get_provider_config(provider_id)
            if not provider:
                continue

            # Filtra por capacidade de visão se necessário
            if require_vision and not provider.get("supports_vision", False):
                continue

            # Skip providers locais se force_local=False e há disponíveis melhores
            is_local = provider.get("local", False)

            est_cost = 0.0 if is_local else _estimate_cost(provider, estimated_tokens)

            billing = check_before_call(
                mission_id=self.mission_id,
                provider=provider_id,
                estimated_cost=est_cost if not is_local else None,
                is_local=is_local,
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

                if not is_local and est_cost > 0:
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
            "deepseek": "_call_openai_compatible",
            "openai":   "_call_openai_compatible",
            "anthropic": "_call_anthropic",
            "gemini":   "_call_gemini",
            "gemma4":   "_call_ollama",
            "ollama":   "_call_ollama",
        }
        method_name = adapters.get(provider_id)
        if not method_name:
            raise ValueError(f"Adapter não encontrado para provider={provider_id}")
        return getattr(self, method_name)(provider, prompt)

    def _call_openai_compatible(self, provider: dict, prompt: str) -> str:
        import urllib.request
        api_key = os.environ.get(provider["env_var"], "")
        payload = json.dumps({
            "model": provider["model_id"],
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1024,
        }).encode("utf-8")
        base_url = provider['base_url']
        endpoint = f"{base_url}/chat/completions" if base_url.endswith("/v1") else f"{base_url}/v1/chat/completions"
        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]

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
