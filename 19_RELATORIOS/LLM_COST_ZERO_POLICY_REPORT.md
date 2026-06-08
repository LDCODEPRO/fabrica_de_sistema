# LLM_COST_ZERO_POLICY_REPORT

Data: 2026-06-05

## Regra oficial implementada

A Fabrica deve usar primeiro recursos ja pagos ou locais:

1. Assinaturas ja pagas, em modo assistido: DeepSeek V4 Pro, Claude Pro, ChatGPT Plus/GPT e Gemini Advanced.
2. Ollama Local, quando health check real confirmar disponibilidade.
3. APIs pagas somente como ultimo recurso, com autorizacao explicita da Diretoria.

## Regras de bloqueio

- Assinatura nao pode ser tratada como API.
- Assinatura nao gera custo por token na plataforma.
- Provider local tem custo incremental zero, mas nao pode ser marcado ativo sem health check.
- API paga exige chave real, Secret Guard aprovado, Billing Guard aprovado, health `active_real`, custo conhecido e autorizacao da Diretoria.
- Sem custo conhecido, a API paga e bloqueada.

## Arquivos alterados

- `17_AUTOMACOES/LLM_ROUTER/cost_zero_policy.py`
- `17_AUTOMACOES/LLM_ROUTER/provider_registry.json`
- `17_AUTOMACOES/LLM_ROUTER/billing_guard.py`
- `17_AUTOMACOES/LLM_ROUTER/llm_router.py`
- `17_AUTOMACOES/LLM_ROUTER/provider_health_check.py`
- `08_SOURCE_OF_TRUTH/LLM_REGISTRY/LLM_USAGE_POLICY.md`
- `08_SOURCE_OF_TRUTH/LLM_REGISTRY/LLM_COST_POLICY.md`
- `08_SOURCE_OF_TRUTH/LLM_REGISTRY/LLM_PROVIDER_TYPES.md`

## Resultado

LLM COST ZERO GOVERNANCE: OK

