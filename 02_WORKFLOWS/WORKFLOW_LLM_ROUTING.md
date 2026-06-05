# WORKFLOW_LLM_ROUTING

## Fluxo Oficial

Missao
-> classificar tarefa
-> escolher perfil de uso
-> aplicar Provider Registry
-> aplicar Billing Guard
-> aplicar Protecao de Segredos
-> validar health real quando houver automacao
-> executar ou encaminhar para uso assistido

## Tarefa Assistida

Ordem:

1. DeepSeek V4 Pro
2. Claude Pro
3. ChatGPT Plus / GPT
4. Gemini Advanced

Resultado: encaminhamento assistido ou conector real. Nao simular API.

## Execucao Automatica

Ordem:

1. Ollama Local com health `active_real`
2. API paga autorizada

## API Paga

Bloqueio padrao. Liberar somente se:

```text
director_approved = true
billing_guard_ok = true
secret_guard_ok = true
provider_health = active_real
```
