# LLM_AUDIT

Data: 2026-06-06
Prompt: `retorne apenas PROVIDER_OK`

## Chamadas reais

| Ordem pedida | Provider testado | Modelo/canal | Resultado | Latencia | Tokens | Custo |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | DeepSeek API | `deepseek-chat` | PROVIDER_OK | media 1.107 ms | 8 estimados por chamada | NAO MEDIDO |
| 2 | Gemini API | `gemini-2.5-flash` | PROVIDER_OK | 1.010 ms | 8 estimados | NAO MEDIDO |
| 3 | OpenAI API | `gpt-4o-mini` | PROVIDER_OK | 1.685 ms | 8 estimados | NAO MEDIDO |
| 4 | Claude assinatura CLI | `claude-subscription` | Timeout | 120.067 ms | 0 registrado | R$ 0 incremental esperado, nao comprovado |
| 5 | Ollama | `llama3.2:latest` | Respondeu, mas desobedeceu ao prompt | 5.181 ms | 22 estimados | R$ 0 incremental |

Teste adicional:

- ChatGPT/Codex assinatura: falhou em 19 ms com `PermissionError: [WinError 5] Acesso negado`.

## Chaves e autenticacao

- `DEEPSEEK_API_KEY`: existe e autenticou.
- `GOOGLE_API_KEY`/`GEMINI_API_KEY`: existe e autenticou.
- `OPENAI_API_KEY`: existe e autenticou.
- `ANTHROPIC_API_KEY`: nao encontrada no ambiente.
- Claude CLI: executavel encontrado, mas a chamada expirou.

Nenhum valor de segredo foi registrado.

## Tokens e custos

- O adapter `provider_router.py` calcula apenas tokens estimados.
- O uso real retornado pelas APIs e descartado.
- O Billing Ledger nao registrou as chamadas executadas em 2026-06-06.
- O custo real das chamadas e desconhecido.

## Ordem real de roteamento

Ordem solicitada pelo proprietario:

1. DeepSeek
2. Gemini
3. OpenAI
4. Claude
5. Ollama

Ordem implementada no runtime da FORJA:

1. Claude assinatura
2. Codex assinatura
3. Ollama

Ordem do Router governado:

- tarefas assistidas iniciam por assinaturas;
- automacao inicia por Ollama;
- APIs pagas estao bloqueadas.

Classificacao: NAO FUNCIONANDO CONFORME ORDEM DEFINIDA.

## Assinaturas

- Gemini Advanced: NAO TESTADA. Apenas Gemini API foi testada.
- ChatGPT Plus/Codex: NAO FUNCIONANDO neste ambiente; CLI retornou acesso negado.
- Claude Pro: NAO FUNCIONANDO nesta auditoria; CLI expirou.
