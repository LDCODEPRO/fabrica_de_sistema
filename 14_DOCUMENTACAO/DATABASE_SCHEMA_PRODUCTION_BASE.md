# DATABASE_SCHEMA_PRODUCTION_BASE

**Data:** 07 de Junho de 2026
**Etapa 6:** Database Production Base
**Propósito:** Definir o mapeamento do Banco de Dados oficial (`nexus.db`) preparado para migração transparente para o PostgreSQL via SQLAlchemy ORM.

## 1. Diagrama Lógico e Estruturas

### Tabelas Principais (Core Engine)
- **`projects`**: Gerenciamento de projetos no radar da FORJA.
  - Colunas: `id`, `name`, `description`, `repository_url`, `status`, `created_at`, `updated_at`
- **`missions`**: Motor principal de atividades e workflows.
  - Colunas: `id`, `title`, `description`, `status`, `created_at`, `updated_at`
- **`agents`**: Módulos inteligentes disponíveis.
  - Colunas: `id`, `name`, `role`, `status`
- **`providers`**: Entidades LLM cadastradas.
  - Colunas: `id`, `name`, `provider_type`, `is_active`

### Tabelas Operacionais e Eventos
- **`mission_events`**: Histórico detalhado de tudo ocorrido em uma missão (Logs em JSON payload).
- **`system_events`**: Log de alto nível de sistemas, falhas, startups e shut-downs do Runtime.
- **`github_events`**: Payload JSON recebido de webhooks externos (Push, Pull Request).
- **`evidences`**: Artefatos físicos, links e descrições provando uma conclusão.
- **`artifacts`**: Registros lógicos de artefatos gerados pelo sistema, salvos localmente (Markdown/JSON).

### Tabelas de Monitoramento e DevOps (Reality Engine)
- **`provider_health_checks`**: Resultados periódicos do tempo de resposta de cada LLM.
- **`deployments`**: Rastreio do pipeline de CD. Status de deploy em staging ou production.
- **`alerts`**: Erros críticos capturados pela observabilidade, requerendo intervenção humana (`is_resolved=False`).
- **`audit_logs`**: Tabela estrita de auditoria forense do próprio sistema.
- **`settings`**: Configurações de UI ou de ambiente persistidas sem deploy.

## 2. Abstração e Escalabilidade
Todas as tabelas utilizam os tipos agnósticos do SQLAlchemy (`String`, `Text`, `Integer`, `DateTime`, `Boolean`, `Float`). Isto garante que a FORJA rode localmente sem dependências usando SQLite (`nexus.db`) e migre imediatamente para PostgreSQL em nuvem alterando apenas a `DATABASE_URL` no `.env`. Nenhuma stored procedure proprietária foi utilizada.
