# DATABASE CONTRACT REPORT

**Status:** VALIDATED
**Módulo Avaliado:** `22_DATABASE_CORE`
**Data da Auditoria:** 2026-06-05

O núcleo de banco de dados oficial da Fábrica, operando sobre SQLite (fabricadb.sqlite), validado via repositórios dinâmicos e migrations executadas até `005`.

## Tabelas e Estruturas Físicas Confirmadas

1. `projects`
   - Schema: id, name, description, client_name, priority, status...
2. `missions`
   - Schema: id, project_id, name, goal, status...
3. `tasks`
   - Schema: id, mission_id, agent_id, name, description, status, priority...
4. `agents` / `agent_profiles`
   - Schema: Perfis de atuação de IAs (Architect, Developer, QA...).
5. `executions` / `agent_executions`
   - Schema: Status da execução em tempo real pelo LLM.
6. `llm_calls`
   - Schema: Registro rastreável de todas as chamadas feitas pelo LLM Router.
7. `evidences`
   - Schema: Arquivamento à prova de adulteração do código gerado (Zero Ghost Law).
8. `audit_logs`
   - Schema: Registro de segurança e ações críticas no core.
9. `deployments`
   - Schema: Controle de versionamento e estado (PENDING, SUCCESS, FAILED).
10. `billing_events`
    - Schema: Gravação rigorosa de custos consumidos pelos provedores da LLM (DeepSeek, etc).

**Veredito:** Toda a arquitetura do Banco de Dados suporta a operação de ponta a ponta sem recorrer a mocks estruturais.
