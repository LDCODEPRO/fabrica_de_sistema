# DATABASE_AUDIT

Data: 2026-06-06
Banco: `nexus.db`

## Checks

- `PRAGMA integrity_check`: `ok`.
- `PRAGMA quick_check`: `ok`.
- `PRAGMA foreign_key_check`: 1 violacao.

Classificacao: WARNING

## Tabelas encontradas

- missions: 7 registros.
- agents: 11 registros.
- audit_logs: 59 registros antes da execucao atual.
- evidences: 17 registros antes da execucao atual; 18 apos o teste.
- knowledge_queries: 4 registros.
- agent_executions: 1 registro.
- agent_memories: 4 registros.
- agent_costs: 1 registro.
- agent_health: 1 registro.
- agent_failures: 0.
- agent_fallbacks: 1.
- memory_entries: 0.

## Tabelas solicitadas

| Tabela | Status |
| --- | --- |
| missions | FUNCIONANDO |
| agents | FUNCIONANDO |
| audit_logs | FUNCIONANDO |
| evidence | NAO ENCONTRADO |
| evidences | FUNCIONANDO PARCIALMENTE |
| billing | NAO ENCONTRADO |

## Violacao referencial

`evidences.id=1` aponta para `mission_id=9001`, que nao existe em `missions`.

Essa evidencia pertence ao smoke test do ORCHESTRATOR e torna o banco inconsistente em integridade referencial.

## Billing

Billing nao e tabela. O estado fica em:

`17_AUTOMACOES/LLM_ROUTER/reports/billing_state.json`

O ledger possui US$ 0,00411 em 2026-06-05, mas nao registrou as chamadas reais de 2026-06-06.

## Backup

Backup criado antes dos testes:

`backups/forensic_audit_nexus_20260606_140201.db`

