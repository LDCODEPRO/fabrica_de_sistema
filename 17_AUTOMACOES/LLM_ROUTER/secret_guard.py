"""
secret_guard.py — Proteção contra vazamento de segredos nos logs.
Mascara automaticamente qualquer padrão de credencial antes de registrar.
"""
import re
import logging
from typing import Any

logger = logging.getLogger(__name__)

SECRET_PATTERNS = [
    (re.compile(r"sk-[a-zA-Z0-9]{20,}"), "OPENAI_KEY"),
    (re.compile(r"sk-ant-[a-zA-Z0-9\-_]{30,}"), "ANTHROPIC_KEY"),
    (re.compile(r"AIza[a-zA-Z0-9_\-]{35}"), "GOOGLE_API_KEY"),
    (re.compile(r"AKIA[A-Z0-9]{16}"), "AWS_ACCESS_KEY"),
    (re.compile(r"[a-zA-Z0-9_\-]{64,}"), "GENERIC_TOKEN_64"),
    (re.compile(r"Bearer\s+[a-zA-Z0-9_\-\.]{20,}"), "BEARER_TOKEN"),
    (re.compile(r"(password|passwd|pwd|secret|token|key|auth)\s*[:=]\s*['\"]?[^\s'\"]{8,}['\"]?",
                re.IGNORECASE), "CREDENTIAL_VALUE"),
]

MASK = "***SECRET_MASKED***"


def mask_secrets(text: str) -> tuple[str, bool]:
    """
    Retorna (texto_mascarado, foi_detectado_segredo).
    Nunca lança exceção — falha silenciosa retorna o texto original mascarado completamente.
    """
    if not isinstance(text, str):
        text = str(text)

    detected = False
    masked = text

    try:
        for pattern, secret_type in SECRET_PATTERNS:
            if pattern.search(masked):
                masked = pattern.sub(MASK, masked)
                detected = True
                logger.warning("SECRET_DETECTED type=%s — valor mascarado, não registrado", secret_type)
    except Exception:
        return MASK, True

    return masked, detected


def safe_log(level: str, message: str, **kwargs: Any) -> None:
    """
    Loga mensagem após mascarar segredos.
    Nunca propaga o valor original de credenciais.
    """
    safe_msg, detected = mask_secrets(message)

    safe_kwargs = {}
    for k, v in kwargs.items():
        safe_v, _ = mask_secrets(str(v))
        safe_kwargs[k] = safe_v

    log_fn = getattr(logger, level.lower(), logger.info)
    log_fn(safe_msg, extra=safe_kwargs)

    if detected:
        logger.critical(
            "SECURITY_ALERT: SECRET_DETECTED no log — valor mascarado. "
            "Revisar código-fonte para evitar exposição."
        )


def validate_no_secrets(data: dict) -> dict:
    """
    Valida que um dict não contém segredos e retorna versão segura.
    Usado antes de salvar relatórios.
    """
    import json
    text = json.dumps(data, default=str)
    masked, detected = mask_secrets(text)

    if detected:
        return json.loads(masked)
    return data
