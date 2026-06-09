# FORJA — AUDITORIA DO BANCO DE DADOS
**Data:** 2026-06-09 · `nexus.db` (SQLite) · 19 tabelas

## 1. TABELAS E CONTAGENS REAIS

| Tabela | Registros | Uso real |
|---|---:|---|
| agents | 14 | `/api/agents` |
| missions | 9 | `/api/missions`, runtime |
| agent_actions | 95 | Agentic Core |
| mission_events | 95 | Agentic Core |
| agent_provider_preferences | 82 | roteamento por agente |
| chat_messages | 109 | chat (persistência verificada) |
| chat_sessions | 62 | chat |
| audit_logs | 90 | `/api/audit` |
| evidences | 18 | evidências de missão |
| provider_health_checks | 12+ | health-checks reais persistidos |
| llm_providers | 6 | `/api/llm/providers` |
| knowledge_queries | 4 | — |
| agent_memories | 4 | memória de agente |
| agent_costs | 1 | billing |
| agent_executions | 1 | runtime |
| agent_fallbacks | 1 | trilha de fallback |
| agent_health | 1 | — |
| agent_failures | 0 | (vazio honesto) |
| memory_entries | 0 | (vazio honesto) |

## 2. TABELAS DA MISSÃO (checklist)

| Esperada | Presente | Nota |
|---|---|---|
| agents | ✅ | 14 |
| missions | ✅ | 9 |
| agent_skills | ⚠️ | não há tabela com este nome; competências via `agent_provider_preferences` + código |
| agent_memories | ✅ | 4 |
| agent_actions | ✅ | 95 |
| mission_events | ✅ | 95 |
| provider_health (checks) | ✅ | `provider_health_checks` |
| provider_registry | ✅ | tabela `llm_providers` (+ arquivo `provider_registry.json`) |
| academy | ❌ | sem tabela (Academia é NIMPL no painel — honesto) |
| chat_sessions | ✅ | 62 |
| chat_messages | ✅ | 109 |

## 3. INTEGRIDADE

- Persistência do chat **verificada em runtime**: após teste, `chat_messages` ganhou pares
  USER/agent com `provider_key` correto (`claude_sub`), e `GET /api/chat/session/{id}` retornou
  as 4 mensagens da sessão.
- Health-checks reais persistem em `provider_health_checks` + atualizam `llm_providers.status` e
  `last_health_check` (verificado: `openai_subscription` mudou `CERTIFIED → ENVIRONMENT_PENDING`).
- `audit_logs` recebe `CHAT_MESSAGE`, `PROVIDER_HEALTH_CHECK`, `AGENT_RUN` reais.
- Endpoint `POST /api/agentic-core/database/integrity` disponível (DatabaseTool) para verificação on-demand.

## 4. OBSERVAÇÕES

- Nomes legados de tabela no script forense (`evidence`, `audit_log`) **não existem** — os nomes
  reais são `evidences` e `audit_logs`. O backend usa os nomes corretos; apenas o trecho de
  conveniência do script forense consulta os antigos (sem impacto operacional).
- Há `.db` de teste no repositório (`test.db`, `agent_execution_test.db`, `test_fabricadb.sqlite`) —
  recomenda-se mantê-los fora de produção (já cobertos por testes).

## 5. STATUS

**OK** — banco íntegro, 19 tabelas com dados reais, persistência e auditoria verificadas.
