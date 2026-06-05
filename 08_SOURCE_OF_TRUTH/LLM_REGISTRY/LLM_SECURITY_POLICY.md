# LLM_SECURITY_POLICY — Política de Segurança
**Versão:** 1.0.0 | **Data:** 2026-06-05

---

## CLASSIFICAÇÃO DE DADOS SENSÍVEIS

### NUNCA REGISTRAR (em nenhum log, relatório ou código)
```
- API Keys / API Tokens
- Refresh tokens
- Session tokens / cookies
- Passwords / senhas
- Private keys (RSA, EC, etc.)
- OAuth secrets
- Webhook secrets
- Database credentials
```

### COMO REFERENCIAR SEGREDOS
```python
# CORRETO
key = os.environ.get("DEEPSEEK_API_KEY")

# ERRADO (nunca fazer)
key = "sk-1234..."  # jamais hardcodar
logger.info(f"Using key: {key}")  # jamais logar valor
```

---

## SECRET_DETECTED PROTOCOL

Quando um segredo for encontrado:

```
1. Registrar: SECRET_DETECTED
2. Registrar: caminho do arquivo (apenas)
3. Registrar: tipo de segredo (API_KEY, TOKEN, etc.)
4. NÃO registrar: o valor
5. NÃO copiar para relatório
6. NÃO incluir em log
7. Recomendar: rotacionar o segredo
```

---

## REGRAS DO SECRET_GUARD

O módulo `secret_guard.py` deve:

1. **Escanear** todo output antes de logar
2. **Detectar** padrões de segredos:
   - `sk-[a-zA-Z0-9]{20,}`  (OpenAI style)
   - `[a-zA-Z0-9_-]{32,}`  (generic tokens)
   - `AIza[a-zA-Z0-9_-]{35}` (Google API)
   - `AKIA[A-Z0-9]{16}` (AWS)
3. **Mascarar** qualquer match: `***SECRET_MASKED***`
4. **Alertar** sobre detecção
5. **Nunca** revelar o valor, mesmo em modo debug

---

## COFRE DE CREDENCIAIS

```
Localização autorizada: E:\ (sistemas externos)
Mecanismo: variáveis de ambiente (.env)
Acesso: apenas por nome da variável
Auditoria anterior: legacy-e-drive-audit.md (C:\Users\conta\.claude\...)
```

---

## AUDIT TRAIL

Cada operação de LLM deve gerar entrada de audit com:
```json
{
  "timestamp": "ISO-8601",
  "mission_id": "string",
  "provider": "string",
  "model": "string",
  "task_type": "string",
  "status": "string",
  "fallback_used": false,
  "cost_estimate": 0.0,
  "secrets_exposed": false
}
```

---

_Fábrica de Sistemas · LLM_SECURITY_POLICY · 2026-06-05_
