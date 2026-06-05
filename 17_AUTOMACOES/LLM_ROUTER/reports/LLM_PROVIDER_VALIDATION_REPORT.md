# LLM_PROVIDER_VALIDATION_REPORT

Data: 2026-06-05
Status: SUBSTITUIDO_POR_LLM_COST_ZERO_GOVERNANCE_V1

Este relatorio substitui versoes anteriores que marcavam providers como ativos apenas por credencial ou assinatura conhecida.

## Estado oficial atual

| Provider | Tipo | Health oficial | Observacao |
| --- | --- | --- | --- |
| DeepSeek V4 Pro | subscription | unknown | Assinatura assistida; sem automacao direta certificada |
| Claude Pro / Claude Code | subscription | unknown | Assinatura assistida; sem custo por token |
| ChatGPT Plus / GPT | subscription | unknown | Assinatura assistida; distinta da OpenAI API |
| Gemini Advanced | subscription | unknown | Assinatura assistida; distinta da Gemini API |
| Ollama Local | local | unknown | Requer `/api/tags` e geracao real |
| APIs pagas | paid_api | missing_key/unknown | Bloqueadas por padrao |

## Fonte de verdade

Usar `17_AUTOMACOES/LLM_ROUTER/provider_registry.json` e os relatorios em `19_RELATORIOS/LLM_COST_ZERO_*`.

