# LLM ENVIRONMENT TEMPLATE - FORJA OS

Este arquivo documenta as variáveis de ambiente necessárias para configurar o ecossistema de LLMs do FORJA OS no outro PC de forma portável, sem expor chaves ou violar a governança.

## Variáveis do Ambiente de IA

```ini
# Perfil e ambiente ativo da Forja
FORJA_ENV=development

# Claude Assinatura (CLI oficial)
CLAUDE_SUBSCRIPTION_ENABLED=true
CLAUDE_AUTH_MODE=CLI_OR_SESSION

# OpenAI / ChatGPT Plus / Codex Assinatura
OPENAI_SUBSCRIPTION_ENABLED=true
OPENAI_AUTH_MODE=APP_OR_CLI_SESSION

# Gemini Google One AI Pro Assinatura
GEMINI_SUBSCRIPTION_ENABLED=true
GEMINI_AUTH_MODE=CLI_OR_BROWSER_SESSION

# Router API Gateway (DeepSeek, Kimi)
OPENROUTER_ENABLED=true
OPENROUTER_API_KEY=CHANGE_ME_SECURELY

# Ollama Local (Daemon local)
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434

# Limites financeiros seguros (Evita consumo excessivo acidental)
FORJA_DAILY_ROUTER_BUDGET=1.30
FORJA_MONTHLY_ROUTER_BUDGET=30.00
```

## Como Usar

1. Copie o arquivo `.env.llm.example` para `.env.llm` ou mescle-o no seu arquivo `.env` principal.
2. Certifique-se de configurar a sua chave do OpenRouter de forma segura localmente.
3. Garanta que os executáveis de CLI (`claude`, `codex`, `gemini`) estejam no PATH ou em seus respectivos locais portáveis.
