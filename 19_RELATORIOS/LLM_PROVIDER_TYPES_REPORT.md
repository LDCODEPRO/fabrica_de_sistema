# LLM_PROVIDER_TYPES_REPORT

Data: 2026-06-05

## Tipos oficiais

| Tipo | Uso | Custo incremental | Automacao |
| --- | --- | --- | --- |
| subscription | Assinaturas ja pagas | 0 | Assistida |
| local | Modelo local | 0 | Direta apos health real |
| paid_api | API paga por uso | Variavel | Bloqueada por padrao |

## Providers registrados

| Provider | Tipo | Health | Agentes diretos |
| --- | --- | --- | --- |
| deepseek_v4_pro | subscription | unknown | nao |
| claude_pro | subscription | unknown | nao |
| chatgpt_plus | subscription | unknown | nao |
| gemini_advanced | subscription | unknown | nao |
| ollama_local | local | unknown | nao |
| openai_api | paid_api | missing_key | nao |
| claude_api | paid_api | missing_key | nao |
| gemini_api | paid_api | missing_key | nao |
| deepseek_api | paid_api | missing_key | nao |

## Observacao Reality First

Nenhum provider foi certificado como ativo sem chamada de health check real. `unknown` e `missing_key` nao significam falha definitiva; significam apenas ausencia de evidencia executada nesta missao.

