# AGENTS_AUDIT

Data: 2026-06-06

## Evidencias gerais

- Os 11 perfis obrigatorios existem no codigo e no banco.
- O registro de perfis foi carregado por teste.
- A suite estrutural teve 4 testes aprovados e 1 falha de Router.
- O teste completo da suite nao coleta porque falta `httpx`.
- O teste ponta a ponta da FORJA passou 9/9, mas acionou apenas QA.
- A resposta Ollama da missao afirmou falsamente que todos os agentes executaram.

## Classificacao por agente

| Agente | Status | Ultima execucao comprovada | Evidencia |
| --- | --- | --- | --- |
| ARCHITECT | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real no banco |
| DEVELOPER | FUNCIONANDO PARCIALMENTE | 2026-06-05 21:53:21 | Evidencia de MIS-001 via DeepSeek |
| QA | FUNCIONANDO PARCIALMENTE | 2026-06-06 17:24:00 UTC | Evidencia 18 via Ollama; conteudo possui alegacao fantasma |
| DOCS | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| ANALYST | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| DESIGNER | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| DEVOPS | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| SECURITY | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| DATA_ENGINEER | FUNCIONANDO PARCIALMENTE | NAO ENCONTRADA | Perfil carrega; sem execucao real |
| AI_ENGINEER | FUNCIONANDO PARCIALMENTE | 2026-06-05 22:33:33 | Evidencia de MIS-002 via Codex |
| ORCHESTRATOR | NAO FUNCIONANDO | 2026-06-05 11:33:41 | `COMPLETED_WITH_LLM_FAILURE`, provider `none` |

## Persistencia

No `nexus.db`:

- `agent_executions`: 1 registro.
- `agent_memories`: 4 registros.
- `agent_costs`: 1 registro.
- `agent_health`: 1 registro.
- `agent_fallbacks`: 1 registro.
- `agent_failures`: 0 registros.

Somente ORCHESTRATOR aparece nessas tabelas do engine completo.

## Falha central

O LLM Router governado bloqueia o Ollama porque o registry permanece com `health_status=unknown`. As assinaturas retornam imediatamente `ASSISTED_SUBSCRIPTION_REQUIRES_HUMAN_INTERFACE`. Assim, os agentes nao possuem caminho automatico funcional pelo Router oficial.

## Conclusao

AGENTES_FUNCIONAM: PARCIAL

Existencia, carga e persistencia parcial foram comprovadas. Execucao real e correta dos 11 agentes nao foi comprovada.

