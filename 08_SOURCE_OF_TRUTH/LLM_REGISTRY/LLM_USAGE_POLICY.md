# LLM_USAGE_POLICY

## Politica De Uso

- Tarefas assistidas priorizam DeepSeek V4 Pro, Claude Pro, ChatGPT Plus e Gemini Advanced.
- Execucao automatica real prioriza Ollama Local validado.
- APIs pagas sao ultimo recurso e ficam bloqueadas por padrao.

## Tarefa Assistida

Pode usar assinatura quando o operador humano ou conector real permitido participa do fluxo.

Nao registrar tokens ou custo por token para assinatura.

## Execucao Automatica

Usar apenas provedores com `automation_mode = direct` ou `connector`.

Ollama Local deve passar health check real antes de ser usado por agentes.

## API Paga

Exige:

- autorizacao da Diretoria
- Billing Guard aprovado
- Protecao de Segredos aprovada
- health status `active_real`
- custo medido ou estimado com base real
