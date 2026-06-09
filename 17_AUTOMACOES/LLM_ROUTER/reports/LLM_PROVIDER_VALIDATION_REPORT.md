# LLM_PROVIDER_VALIDATION_REPORT
**Gerado:** 2026-06-09T04:30:24.085412

| Provider | Status | Motivo |
|----------|--------|--------|
| DeepSeek V4 Pro | ❌ unknown | Assinatura/interface exige validação humana ou conector real; sem health automático nesta execução |
| Claude Pro | ❌ unknown | Assinatura/interface exige validação humana ou conector real; sem health automático nesta execução |
| ChatGPT Plus / GPT | ❌ unknown | Assinatura/interface exige validação humana ou conector real; sem health automático nesta execução |
| Gemini Google One AI Pro | ❌ unavailable | Chamada real falhou: RuntimeError: gemini_cli sem saída |
| Ollama Local | ❌ unavailable | OLLAMA_UNAVAILABLE: URLError |
| OpenAI API | ❌ missing_key | Variável OPENAI_API_KEY não configurada |
| Claude API | ❌ missing_key | Variável ANTHROPIC_API_KEY não configurada |
| Gemini API | ❌ missing_key | Variável GOOGLE_API_KEY não configurada |
| OpenRouter API | ✅ active_real | Health check OK. Resposta: SUCESSO |
| DeepSeek API | ❌ missing_key | Variável DEEPSEEK_API_KEY não configurada |

## AUDITORIA DE SEGURANÇA
- Nenhum valor de credencial foi registrado neste relatório.
- Apenas existência de variáveis de ambiente foi verificada.

_Gerado por provider_health_check.py · 2026-06-09_