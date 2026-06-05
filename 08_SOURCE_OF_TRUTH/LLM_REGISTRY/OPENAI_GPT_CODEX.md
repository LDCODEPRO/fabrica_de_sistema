# OPENAI GPT / CODEX — Motor de Validação
**Posição:** 3º na hierarquia | **Data:** 2026-06-05

## IDENTIDADE
```
Provider:   OpenAI
Models:     gpt-4o, gpt-4o-mini, o3, o4-mini (Codex via API)
Tier:       PAID (assinatura ChatGPT Plus/Pro preferida)
Position:   TERTIARY — Validação, código crítico, revisão
```

## FUNÇÕES AUTORIZADAS
- Revisão final de código
- Geração de código crítico
- Testes e validação de arquitetura
- Prompts complexos
- Capacidade multimodal (GPT-4o)
- Codex para execução quando assinatura permitir

## CONFIGURAÇÃO
```
env_var:    OPENAI_API_KEY
base_url:   https://api.openai.com/v1
model_id:   gpt-4o (produção), gpt-4o-mini (econômico)
context:    128K tokens
```

## POLÍTICA DE ASSINATURA
- Preferir assinatura ChatGPT Plus/Pro sobre API paga
- API apenas com autorização explícita e billing_guard ativo
- Codex: usar somente via assinatura quando disponível

## STATUS ATUAL
```
STATUS: API_KEY_REQUIRED
Evidência: E:\Agente X\.env (SECRET_DETECTED)
```
