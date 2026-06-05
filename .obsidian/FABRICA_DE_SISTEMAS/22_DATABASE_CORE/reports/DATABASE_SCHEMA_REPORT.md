# DATABASE_SCHEMA_REPORT

## Entidades e Relacionamentos
* **Core:** `projects` -> `missions` -> `mission_events`
* **Agent:** `agents` -> `agent_profiles`, `agent_executions`, `agent_memory`
* **LLM:** `llm_providers` -> `llm_models` -> `llm_routing_rules`, `llm_calls`, `knowledge_queries`
* **Audit & Evidence:** `evidences`, `audit_logs`, `billing_events`, `system_health`, `backup_events`

## Tipagem e Padrões (SQL)
- Chaves primárias: `TEXT` (UUID padrão)
- Datas: `DATETIME DEFAULT CURRENT_TIMESTAMP`
- Chaves Estrangeiras: Enforced via `PRAGMA foreign_keys = ON;` no manager.
- Soft Delete: `status` field em vez de `DELETE`.
