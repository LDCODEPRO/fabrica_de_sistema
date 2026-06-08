# AUDIT_INVENTORY

Data da auditoria: 2026-06-06
Missao: FACTORY_FORENSIC_AUDIT_V2
Regra: nenhum item funcional sem evidencia executada.

## Resumo do inventario

- Arquivos relevantes encontrados: 1.553.
- Governanca: 12 arquivos.
- Regras: 11 arquivos.
- Workflows: 63 arquivos em 12 grupos.
- Skills: 61 arquivos em 12 grupos.
- Agentes: 221 arquivos em 19 grupos.
- Knowledge Engine: 24 arquivos.
- Evidence System: 26 arquivos.
- Sistemas: 155 arquivos em 4 grupos.
- Automacoes: 73 arquivos.
- Operational Core: 55 arquivos em 8 modulos.
- Testes do Operational Core: 15 arquivos.

## Componentes principais

| Area | Implementacao encontrada | Classificacao |
| --- | --- | --- |
| Frontend FORJA OS | `16_SISTEMAS/FORJA_OS_PLATFORM` | FUNCIONANDO PARCIALMENTE |
| Backend consolidado | `forja_os_server.py` | FUNCIONANDO |
| API antiga de conhecimento | `20_OPERATIONAL_CORE/04_KNOWLEDGE_API/main.py` | NAO FUNCIONANDO PARA PRODUCAO |
| Runtime usado pela FORJA | `agent_runtime.py` | FUNCIONANDO PARCIALMENTE |
| Agent Execution Engine | `20_OPERATIONAL_CORE/08_AGENT_EXECUTION_ENGINE` | FUNCIONANDO PARCIALMENTE |
| LLM Router governado | `17_AUTOMACOES/LLM_ROUTER/llm_router.py` | NAO FUNCIONANDO PARA EXECUCAO AUTOMATICA |
| Router alternativo da FORJA | `provider_router.py` | FUNCIONANDO PARCIALMENTE |
| Banco principal | `nexus.db` | FUNCIONANDO PARCIALMENTE |
| Database Core legado | `FABRICA_DE_SISTEMAS/22_DATABASE_CORE` | FUNCIONANDO PARCIALMENTE |
| Docker/Compose | Dockerfile e tres arquivos Compose | FUNCIONANDO PARCIALMENTE |
| Ollama | Servico HTTP em `127.0.0.1:11434` | FUNCIONANDO PARCIALMENTE |

## Bancos encontrados

- `nexus.db`: banco usado pela FORJA OS.
- `agent_execution_test.db`: banco de testes.
- `test.db`: banco de testes.
- `test_fabricadb.sqlite`: banco de testes.
- `FABRICA_DE_SISTEMAS/22_DATABASE_CORE/fabricadb.sqlite`: Database Core legado.
- Copia adicional de `fabricadb.sqlite` dentro de `.obsidian`.

## APIs encontradas

Backend consolidado:

- `/api/health`
- `/api/missions`
- `/api/agents`
- `/api/audit`
- `/api/billing/status`
- `/api/dashboard`
- `/api/llm/providers`
- `/api/llm/health`
- `/api/runtime/status`
- `/api/projects`
- `/api/panel/truth-status`

API antiga:

- `/health`
- `/agents`
- `/search`
- `/query`
- Endpoints estaticos de frameworks, patterns, books, authors e tools.

## Containers

- `docker-compose.yml`: Operational Core antigo.
- `docker-compose.local.yml`: Operational Core + FORJA Nginx.
- `docker-compose.vps.yml`: perfil VPS.
- As configuracoes passam `docker compose config`.
- O daemon Docker estava desligado; containers nao foram executados.

## Evidencias de inconsistencias

- O Docker inicia `20_OPERATIONAL_CORE.04_KNOWLEDGE_API.main:app`, nao `forja_os_server:app`.
- O healthcheck Docker usa `/health`; o backend consolidado usa `/api/health`.
- A API antiga contem respostas marcadas como `Simulated`.
- A Factory Engine antiga retorna IDs fixos como `proj-uuid-1234`.
- Existem caminhos rigidos `D:\fabricadesistema` e referencias legadas a `E:\`.
- O frontend possui fallback `window.FORJA`; abrir a tela nao garante backend conectado.
- O `package.json` nao possui `npm run dev` nem Vite.

