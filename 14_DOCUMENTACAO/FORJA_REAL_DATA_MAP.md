# FORJA_REAL_DATA_MAP

**Data:** 07 de Junho de 2026
**Etapa 5:** Mapa de Dados Reais
**Propósito:** Definir de onde (Tabela/Arquivo/API) a HOME consumirá os dados via Reality Engine.

| Domínio / Módulo | Origem de Dados | Tabela (DB) / Arquivo | Frequência de Atualização | Status Atual | Responsável (Collector) |
|------------------|------------------|------------------------|---------------------------|--------------|-------------------------|
| **MISSÕES** | Banco de Dados SQLite | `missions`, `mission_events` | Contínua (Runtime) | **REAL** | `mission_collector.py` |
| **AGENTES** | Banco de Dados SQLite | `agents` | Contínua (Runtime) | **REAL** | `mission_collector.py` |
| **PROVIDERS** | DB + Arquivo de Registro | `providers`, `provider_health_checks` | Intervalos de 5 min | **PARCIAL** | `provider_collector.py` |
| **PROJETOS** | Banco de Dados SQLite | `projects` | Manual / Sincronizado | FONTE AUSENTE - IMPLEMENTAR | `project_collector.py` |
| **ARTEFATOS** | Filesystem + Banco | `artifacts`, `19_RELATORIOS/` | Sob demanda | FONTE AUSENTE - IMPLEMENTAR | `evidence_collector.py` / `filesystem_collector.py` |
| **ALERTAS** | Banco de Dados SQLite | `alerts`, `system_events` | Em tempo real (Triggers) | FONTE AUSENTE - IMPLEMENTAR | `alert_collector.py` |
| **GITHUB** | API Externa + Webhooks | `github_events` | Webhook Push | FONTE AUSENTE - IMPLEMENTAR | `github_collector.py` |
| **DEPLOYS** | Logs CI/CD + Banco | `deployments` | Após cada push na master | FONTE AUSENTE - IMPLEMENTAR | `deployment_collector.py` |
| **EVIDÊNCIAS** | Banco de Dados SQLite | `evidences` | Contínua (Missões) | **REAL** | `evidence_collector.py` |
| **TIMELINE** | View SQL Consolidada | União de Eventos (Missions + System) | Contínua | FONTE AUSENTE - IMPLEMENTAR | `timeline_collector.py` |

---

### Diretrizes do Reality Engine
Qualquer domínio que possua **FONTE AUSENTE - IMPLEMENTAR** no Status Atual deve retornar `status: not_configured` na API `GET /api/home/*` até que a Tabela e as coletas estejam operantes. O Frontend (React/Designer) deve estar preparado para renderizar "Sem Dados" ou "Configuração Necessária" e jamais preencher *arrays* aleatórios.
