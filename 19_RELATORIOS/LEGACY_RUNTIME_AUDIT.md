# LEGACY_RUNTIME_AUDIT.md
## Auditoria de Componentes Executáveis — Unidade E:\ (Legado)

**Auditor:** Fábrica de Sistemas — Agente Auditor
**Data:** 2026-06-04
**Modo:** ANÁLISE SOMENTE (Zero Ghost Law ativa — E:\ tratada como SOMENTE LEITURA)
**Escopo:** Componentes executáveis (scripts, CLIs, APIs, bancos, orquestradores, motores, launchers) detectados no mapeamento da unidade E:\

---

## 1. Sumário Executivo por Tipo

Esta auditoria cataloga os componentes **executáveis** (não documentos, não templates estáticos) encontrados nos 13 projetos mapeados em E:\. A classificação de reuso considera: portabilidade (paths hardcoded), segurança (credenciais expostas), maturidade (mock vs. real), duplicação e valor arquitetural para a Fábrica.

| Tipo de Componente | Quantidade | PRONTO P/ REUSO | PRECISA REFATORAÇÃO | OBSOLETO |
|---|---:|---:|---:|---:|
| **Orquestradores / Maestros** | 14 | 4 | 8 | 2 |
| **Motores (engines/guards/routers)** | 38 | 18 | 16 | 4 |
| **APIs / Servidores (Flask/FastAPI/Node/PHP)** | 17 | 4 | 9 | 4 |
| **CLIs / Scripts utilitários (Python)** | 52 | 14 | 26 | 12 |
| **Scripts de auditoria / teste** | 24 | 11 | 9 | 4 |
| **Launchers / Batch / PowerShell** | 30 | 5 | 9 | 16 |
| **Bancos / Cofres (SQLite/Vault)** | 6 | 4 | 2 | 0 |
| **Instaladores / Binários (.exe)** | 6 | 0 | 0 | 6 |
| **TOTAL** | **187** | **60** | **79** | **48** |

> Nota: a contagem por tipo soma 187 entradas catalogadas. Componentes que aparecem em múltiplas cópias (ex.: Antigravity replicado em 3 níveis, SISTEMA ONE com e sem underscore) foram contados em suas instâncias físicas, mas marcados como DUPLICATA na tabela completa para evitar reuso redundante. O número final consolidado de executáveis distintos catalogados aparece em **TOTAL_EXECUTAVEIS** ao fim do documento.

### Leitura rápida
- **Maior densidade de valor reaproveitável:** `E:\NIVEL 1` (Nexus_Claude — módulos genéricos: `model_router`, `budget_guard`, `safe_gate`, `api_vault`, `llm_factory`), `E:\NIVEL 2` (NEXUSPREMIUM — pipeline cognitivo + SafeGate + economy router), `E:\PHANDORA` (governança + OGV pipeline), `E:\SISTEMA_ONE` (LLM Router 5-provider + Mission State Machine).
- **Maior risco:** credenciais expostas em `.env` (Antigravity, NIVEL 3, Sistema_open_claude) e token Telegram hardcoded em `E:\LDCODE\server.js`.
- **Maior obsolescência:** binários `.exe` (instaladores VSCode-fork ~218MB), batches de commit por missão (COMMIT_M6-M9), e duplicatas integrais de projetos.

---

## 2. Tabela Completa de Componentes Executáveis

Legenda Tipo: ORQ=Orquestrador · ENG=Motor/Engine · API=Servidor/API · CLI=Script/CLI · AUD=Auditoria/Teste · LCH=Launcher/Batch/PS · DB=Banco/Cofre · BIN=Binário/Instalador

### 2.1 E:\Agente X

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| agente_x.py | ORQ | Agente X (entry point) | Python 3.10+, ReAct | PRONTO PARA REUSO |
| 03_RUNTIME/maestro.py | ORQ | Agente X (daemon 24/7) | Python, --daemon/--once/--task | PRONTO PARA REUSO |
| setup_agente_x.py | CLI | Agente X | Python | PRECISA REFATORACAO |
| agente_diagnostico.py | AUD | Agente X | Python | PRONTO PARA REUSO |
| demo_mode.py | CLI | Agente X | Python | OBSOLETO |
| test_llm.py | AUD | Agente X | Python | PRONTO PARA REUSO |
| 06_CONTAINERS/whatsapp/whatsapp_agent.py | API | Agente X | FastAPI (porta 3001) | PRECISA REFATORACAO |
| 06_CONTAINERS/whatsapp/servidor.js | API | Agente X | Node.js/whatsapp-web.js (3000) | PRECISA REFATORACAO |
| 04_WORKSPACE_MONITOR/monitor_backend.py | API | Agente X | Python | PRECISA REFATORACAO |
| 10_GITHUB/save_manager.py | CLI | Agente X | Python/Git | PRONTO PARA REUSO |
| 10_GITHUB/daily_report_generator.py | CLI | Agente X | Python | PRONTO PARA REUSO |
| 00_GOVERNANCE/safe_gate.py | ENG | Agente X | Python | PRONTO PARA REUSO |
| 00_GOVERNANCE/risk_engine.py | ENG | Agente X | Python | PRONTO PARA REUSO |
| 00_GOVERNANCE/executive_monitor.py | ENG | Agente X | Python | PRECISA REFATORACAO |
| 00_GOVERNANCE/baseline_freezer.py | ENG | Agente X | Python | PRONTO PARA REUSO |
| 13_BACKUPS_DIARIOS/BACKUP_DIARIO.bat | LCH | Agente X | Batch | PRECISA REFATORACAO |
| 10_GITHUB/git_save.bat | LCH | Agente X | Batch | PRECISA REFATORACAO |
| COMMIT_M6/M7/M8/M9.bat | LCH | Agente X | Batch | OBSOLETO |
| 04_WORKSPACE_MONITOR/monitor_run.bat | LCH | Agente X | Batch | OBSOLETO |
| 06_CONTAINERS/whatsapp/INICIAR_WHATSAPP.bat | LCH | Agente X | Batch | OBSOLETO |

### 2.2 E:\Antigravity / E:\NIVEL 3 ANTIGRAVITY (duplicatas — mesmo sistema AMYGO/Nexus Sovereign)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| Antigravity_MASTER.exe (218MB) | BIN | Antigravity | VSCode fork installer | OBSOLETO |
| INSTALAR_AMYGO.exe (15MB) | BIN | Antigravity | Installer | OBSOLETO |
| AMIGO.exe (210MB) | BIN | NIVEL 3 | VSCode fork | OBSOLETO |
| Antigravity.exe | BIN | NIVEL 3 | VSCode fork | OBSOLETO |
| NEXUS_OS.py | ORQ/API | Antigravity | Flask+SocketIO | PRECISA REFATORACAO |
| nexus_brain.py | ENG | Antigravity | Python/SQLite | PRECISA REFATORACAO |
| llm_factory.py (Gemini) | ENG | Antigravity | Python/Gemini | PRECISA REFATORACAO |
| CHAVEIRO_MAESTRO.py | CLI | Antigravity | Python/Gemini | PRECISA REFATORACAO |
| SOVEREIGN_BRIDGE.py | ENG | Antigravity | Python/Gemini Pro | PRECISA REFATORACAO |
| NEXUS_ULTIMATE.py | CLI | Antigravity | Python/Gemini Pro | OBSOLETO |
| migrate_to_d.py | CLI | Antigravity | Python (path hardcoded) | OBSOLETO |
| local_soul/nexus_engine.py | API | Antigravity_Clone | Flask | PRECISA REFATORACAO |
| local_soul/app.py | API | Antigravity_Clone | Flask | PRECISA REFATORACAO |
| local_soul/amigo_app.py | API | Antigravity_Clone | pywebview/Flask | OBSOLETO |
| local_soul/agents/base_agent.py | ENG | Antigravity_Clone | Python (Blackboard) | PRECISA REFATORACAO |
| local_soul/agents/coder.py | ENG | Antigravity_Clone | Python | PRECISA REFATORACAO |
| local_soul/core/blackboard.py | ENG | Antigravity_Clone | Python (shared state) | PRONTO PARA REUSO |
| local_soul/core/llm_factory.py | ENG | Antigravity_Clone | OpenRouter/Ollama | PRONTO PARA REUSO |
| local_soul/core/migrate_system.py | CLI | Antigravity_Clone | Python | OBSOLETO |
| bin/antigravity / antigravity.cmd | LCH | Antigravity_Clone | Shell/Batch | OBSOLETO |
| NIVEL 3: NEXUS_OS / nexus_brain / SOVEREIGN_BRIDGE / CHAVEIRO_MAESTRO / NEXUS_ULTIMATE / migrate_to_d / llm_factory | DUPLICATA | NIVEL 3 (AMYGO_Sovereign) | Python | OBSOLETO (duplicata) |
| NIVEL 3: nexus_engine / coder / migrate_system / base_agent | DUPLICATA | NIVEL 3 (Antigravity_Sovereign) | Python | OBSOLETO (duplicata) |

### 2.3 E:\Biblioteca + E:\BIBLIOTECA_COMPLEXO_ZEUS (ZEUS, PHANDORA-cópia, Sistema_open_claude-cópia)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| Scripts/audit_adaptive_router_v35.py | AUD | ZEUS | Python | PRONTO PARA REUSO |
| Scripts/audit_cognitive_router.py | AUD | ZEUS | Python | PRONTO PARA REUSO |
| Scripts/audit_cost_aware_routing.py | AUD | ZEUS | Python | PRONTO PARA REUSO |
| Scripts/audit_personal_executive_memory.py | AUD | ZEUS | Python | PRECISA REFATORACAO |
| Scripts/audit_trimotor.py / audit_trimotor_fresh_keys.py | AUD | ZEUS | Python | PRECISA REFATORACAO |
| Scripts/auto_repair.py | CLI | ZEUS | Python | PRECISA REFATORACAO |
| Scripts/db_backup.py | CLI | ZEUS | Python/SQLite | PRONTO PARA REUSO |
| Scripts/kanban_live_render.py | CLI | ZEUS | Python | PRECISA REFATORACAO |
| Scripts/kanban_live_start.bat | LCH | ZEUS | Batch | OBSOLETO |
| Scripts/sincronizacao.py | CLI | ZEUS | Python | PRECISA REFATORACAO |
| Scripts/update_panel.py | CLI | ZEUS | Python | PRECISA REFATORACAO |
| 02_AGENTES/monitor_zeus_ultra.py | ENG | ZEUS | Python | PRECISA REFATORACAO |
| 02_AGENTES/fix_monitor_bloqueio.py | CLI | ZEUS | Python (fix pontual) | OBSOLETO |
| 02_AGENTES/zeus_brain_fix.py | CLI | ZEUS | Python (fix pontual) | OBSOLETO |
| 07_WORKFLOWS/execute_workflow_create_mission.py | ENG | ZEUS | Python | PRONTO PARA REUSO |
| 04_PROJETOS/ZEUS_COMMAND_CENTER/burnin_mission_043_5b.py | AUD | ZEUS | Python (chaos) | PRONTO PARA REUSO |
| .../death_test_final.py | AUD | ZEUS | Python (chaos) | PRONTO PARA REUSO |
| .../burnin_stress_injector.py | AUD | ZEUS | Python (stress) | PRONTO PARA REUSO |
| 04_PROJETOS/ZEUS_TASK_SAAS/app.py | API | ZEUS | Flask/FastAPI | PRECISA REFATORACAO |
| SISTEMA ONE/tools/sync_guard.ps1 | LCH | SISTEMA ONE (cópia) | PowerShell | OBSOLETO (duplicata) |
| SISTEMA ONE/tools/verify_sync.ps1 | LCH | SISTEMA ONE (cópia) | PowerShell | OBSOLETO (duplicata) |
| Sistema_open_claude/Orquestrador/orquestrador.py | ORQ | Open Claude (cópia) | Python | PRECISA REFATORACAO |
| Sistema_open_claude/Orquestrador/hermes_core.py | ENG | Open Claude (cópia) | Python | PRONTO PARA REUSO |
| Sistema_open_claude/Orquestrador/memoria_engine.py | ENG | Open Claude (cópia) | Python | PRONTO PARA REUSO |
| Sistema_open_claude/Orquestrador/crons_engine.py | ENG | Open Claude (cópia) | Python | PRECISA REFATORACAO |
| Sistema_open_claude/Orquestrador/skills_engine.py | ENG | Open Claude (cópia) | Python | PRONTO PARA REUSO |
| Sistema_open_claude/Orquestrador/auto_sync.py | CLI | Open Claude (cópia) | Python/Git | PRECISA REFATORACAO |
| Sistema_open_claude/Orquestrador/validador.py | ENG | Open Claude (cópia) | Python | PRECISA REFATORACAO |
| Sistema_open_claude/Backend/servidor.py | API | Open Claude (cópia) | Flask/FastAPI | PRECISA REFATORACAO |
| Sistema_open_claude/WhatsApp/servidor.js | API | Open Claude (cópia) | Node.js | PRECISA REFATORACAO |
| PHANDORA/01_CORE/memory_manager.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/01_CORE/memory_classifier.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/01_CORE/memory_consolidator.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/01_CORE/memory_retrieval.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/01_CORE/memory_health.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/02_TOOLS/filesystem_tool.py | ENG | PHANDORA (cópia) | Python | PRECISA REFATORACAO |
| PHANDORA/02_TOOLS/github_tool.py | ENG | PHANDORA (cópia) | Python/Git | PRONTO PARA REUSO |
| PHANDORA/02_TOOLS/obsidian_tool.py | ENG | PHANDORA (cópia) | Python | PRONTO PARA REUSO |
| PHANDORA/02_TOOLS/terminal_tool.py | ENG | PHANDORA (cópia) | Python | PRECISA REFATORACAO |
| PHANDORA/03_INTERFACE/app.py | API | PHANDORA (cópia) | Python HTTP | PRECISA REFATORACAO |
| PHANDORA/03_INTERFACE/state_manager.py | ENG | PHANDORA (cópia) | Python | PRECISA REFATORACAO |
| PHANDORA/03_INTERFACE/websocket_manager.py | ENG | PHANDORA (cópia) | Python/WebSocket | PRECISA REFATORACAO |

> Nota: `E:\BIBLIOTECA_COMPLEXO_ZEUS` (raiz) e `E:\Biblioteca\BIBLIOTECA_COMPLEXO_ZEUS` contêm os mesmos scripts de auditoria/agentes — tratados como uma origem ZEUS; a versão raiz adiciona `audit_trimotor_fresh_keys.py` e os scripts do ZEUS_COMMAND_CENTER/ZEUS_TASK_SAAS.

### 2.4 E:\LDCODE

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| server.js | API | LDCODE | Node.js/Express/Socket.io | PRECISA REFATORACAO (token Telegram hardcoded) |
| api/save.php | API | LDCODE | PHP | OBSOLETO |
| scratch/capture.js | CLI | LDCODE | Puppeteer | PRONTO PARA REUSO |
| publicar-github.bat | LCH | LDCODE | Batch/Git | OBSOLETO |

### 2.5 E:\NIVEL 1 (Complexo_Nexus + Nexus_Claude)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| Complexo_Nexus/Core/sinfonia_nexus.py | ORQ | Complexo_Nexus | Python | PRECISA REFATORACAO |
| Complexo_Nexus/Core/nexus_mcp_server.py | API | Complexo_Nexus | MCP/asyncio | PRONTO PARA REUSO |
| Complexo_Nexus/Core/forja_nexus.py | ENG | Complexo_Nexus | Python/LLM | PRONTO PARA REUSO |
| Complexo_Nexus/Core/forjar_todas_equipes.py | CLI | Complexo_Nexus | Python | PRECISA REFATORACAO |
| Complexo_Nexus/Core/checar_saude.py | AUD | Complexo_Nexus | Python | PRONTO PARA REUSO |
| Complexo_Nexus/gerar_run_py.py | CLI | Complexo_Nexus | Python | PRECISA REFATORACAO |
| Complexo_Nexus/atualizar_cofre.py | CLI | Complexo_Nexus | Python/SQLite | PRECISA REFATORACAO |
| Complexo_Nexus/diagnostico_cofre.py | AUD | Complexo_Nexus | Python/SQLite | PRONTO PARA REUSO |
| Complexo_Nexus/START_DASHBOARD.bat | LCH | Complexo_Nexus | Batch (porta 5000) | OBSOLETO |
| Complexo_Nexus/START_MONITOR_CENTRAL.bat | LCH | Complexo_Nexus | Batch | OBSOLETO |
| NexusPremium_Executor_Local/resgatar_nexuspremium.py | CLI | NIVEL 1 | Python | OBSOLETO |
| NexusPremium_Executor_Local/EXECUTAR_RESGATE_NEXUSPREMIUM.bat | LCH | NIVEL 1 | Batch | OBSOLETO |
| Security/API_Vault/api_vault.py | DB | NIVEL 1 | Python/SQLite | PRONTO PARA REUSO |
| Security/API_Vault/adicionar_chave.py | CLI | NIVEL 1 | Python | PRONTO PARA REUSO |
| MultiAgent_App/Agents/guardiao_agent.py | ENG | NIVEL 1 | ChromaDB/OpenAI | PRECISA REFATORACAO |
| MultiAgent_App/Agents/bibliotecario_ingestor.py | CLI | NIVEL 1 | Python/PyMuPDF | PRECISA REFATORACAO |
| MultiAgent_App/Agents/pesquisador_agent.py | ENG | NIVEL 1 | Python | PRECISA REFATORACAO |
| RESGATE/Nexus_Claude/Core/sinfonia.py | ORQ | Nexus_Claude | Python/Anthropic | PRECISA REFATORACAO |
| RESGATE/Nexus_Claude/Core/maestro.py | ORQ | Nexus_Claude | Python | PRECISA REFATORACAO |
| RESGATE/Nexus_Claude/Core/auto_mission.py | ENG | Nexus_Claude | Python | PRECISA REFATORACAO |
| RESGATE/Nexus_Claude/Core/model_router.py | ENG | Nexus_Claude | Python | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/Core/safe_gate.py | ENG | Nexus_Claude | Python | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/Core/budget_guard.py | ENG | Nexus_Claude | Python (BRL) | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/Core/goal_manager.py | ENG | Nexus_Claude | Python | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/Core/llm_factory.py | ENG | Nexus_Claude | Python (factory) | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/_gerar_agentes.py | CLI | Nexus_Claude | Python | PRONTO PARA REUSO |
| RESGATE/Nexus_Claude/iniciar_nexus.bat | LCH | Nexus_Claude | Batch | OBSOLETO |
| RESGATE/NexusCofre/.../backup.bat | LCH | NexusCofre | Batch | PRECISA REFATORACAO |
| RESGATE/NexusCofre/.../restore.bat | LCH | NexusCofre | Batch | PRECISA REFATORACAO |

### 2.6 E:\NIVEL 2 (NEXUSPREMIUM)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| core/orchestrator/sinfonia_nexus.py | ORQ | NEXUSPREMIUM | Python/ThreadPoolExecutor/Pydantic | PRONTO PARA REUSO |
| core/orchestrator/nexus_router_economia.py | ENG | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| core/orchestrator/trigger_mission_6h.py | ENG | NEXUSPREMIUM | Python (scheduler) | PRECISA REFATORACAO |
| core/orchestrator/base_nexus_manager.py | ENG | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| core/executor/executor.py | ENG | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| core/executor/actions.py | ENG | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| core/executor/safe_gate.py | ENG | NEXUSPREMIUM | Python (risk class) | PRONTO PARA REUSO |
| core/nexus_mcp_server.py | API | NEXUSPREMIUM | MCP/asyncio | PRONTO PARA REUSO |
| core/cognitive/cognitive_pipeline.py | ENG | NEXUSPREMIUM | Python (5 fases) | PRONTO PARA REUSO |
| core/backend/server.py | API | NEXUSPREMIUM | Python REST | PRECISA REFATORACAO |
| core/index.js | ORQ/API | NEXUSPREMIUM | Node.js (62KB) | PRECISA REFATORACAO |
| core/agent_runtime/specialist_agent.py | ENG | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| managers/O_Maestro/run.py | ORQ | NEXUSPREMIUM | Python | PRECISA REFATORACAO |
| managers/O_Programador/run.py | ENG | NEXUSPREMIUM | Python | PRECISA REFATORACAO |
| managers/O_Analista/run.py | ENG | NEXUSPREMIUM | Python | PRECISA REFATORACAO |
| managers/O_Validador/run.py | ENG | NEXUSPREMIUM | Python | PRECISA REFATORACAO |
| vault/secrets/api_vault.py | DB | NEXUSPREMIUM | Python/SQLite | PRONTO PARA REUSO |
| vault/secrets/adicionar_chave.py | CLI | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| scripts/iniciar_missao_fase_5.py | CLI | NEXUSPREMIUM | Python | OBSOLETO |
| scripts/smoke_test_v1.py | AUD | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| scripts/validate_brain.py | AUD | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| scripts/vault_migration_safe.ps1 | LCH | NEXUSPREMIUM | PowerShell | PRECISA REFATORACAO |
| scripts/exportar_relatorios.py | CLI | NEXUSPREMIUM | Python | PRECISA REFATORACAO |
| scripts/verify_sovereignty.py | AUD | NEXUSPREMIUM | Python | PRONTO PARA REUSO |
| start_nexus.bat | LCH | NEXUSPREMIUM | Batch | OBSOLETO |

### 2.7 E:\PHANDORA (origem canônica)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| 01_CORE/runtime/phandora_runtime.py | ORQ | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/runtime/heartbeat_engine.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/runtime/watchdog.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/runtime/scheduler_engine.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/runtime/queue_manager.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/brain/safe_gate.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/brain/hallucination_guard.py | ENG | PHANDORA | Python (scoring) | PRECISA REFATORACAO (modo mock) |
| 01_CORE/brain/decision_engine.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/brain/orchestration_engine.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/brain/grounding_orchestrator.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/llm/llm_router.py | ENG | PHANDORA | Python (fallback) | PRONTO PARA REUSO |
| 01_CORE/llm/billing_guard.py | ENG | PHANDORA | Python ($1/dia) | PRONTO PARA REUSO |
| 01_CORE/llm/ollama_provider.py | ENG | PHANDORA | Python/Ollama | PRONTO PARA REUSO |
| 01_CORE/security/prompt_injection_guard.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/security/filesystem_guard.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/security/credential_guard.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/security/threat_detector.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/audit/forensic_self_audit_engine.py | AUD | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/audit/integrity_checker.py | AUD | PHANDORA | Python/SHA-256 | PRONTO PARA REUSO |
| 01_CORE/audit/placeholder_hunter.py | AUD | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/pipeline/observe_ground_verify.py | ENG | PHANDORA | Python (OGV) | PRONTO PARA REUSO |
| 01_CORE/learning/learning_engine.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/learning/preference_learner.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 01_CORE/memory_manager.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 01_CORE/memory_health.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 03_INTERFACE/app.py | API | PHANDORA | Python HTTP (8080) | PRECISA REFATORACAO |
| 03_BASELINES/.../health_and_snapshot.py | AUD | PHANDORA | Python | PRONTO PARA REUSO |
| 02_TOOLS/filesystem_tool.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |
| 02_TOOLS/github_tool.py | ENG | PHANDORA | Python/Git | PRONTO PARA REUSO |
| 02_TOOLS/obsidian_tool.py | ENG | PHANDORA | Python | PRONTO PARA REUSO |
| 02_TOOLS/terminal_tool.py | ENG | PHANDORA | Python | PRECISA REFATORACAO |

### 2.8 E:\SISTEMA ONE + E:\SISTEMA_ONE (duplicatas — orquestrador executivo)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| tools/sync_guard.ps1 | LCH | SISTEMA ONE | PowerShell/Git | PRECISA REFATORACAO |
| tools/verify_sync.ps1 | LCH | SISTEMA ONE | PowerShell/Git | PRECISA REFATORACAO |
| 04_MONITOR/monitor_guard.py | AUD | SISTEMA ONE | Python | PRONTO PARA REUSO |
| 04_MONITOR/monitor_server.js | API | SISTEMA ONE | Node.js (porta 4177) | PRONTO PARA REUSO |
| 04_MONITOR/monitoring_one.js | CLI | SISTEMA ONE | JavaScript (UI) | PRECISA REFATORACAO |
| 04_MONITOR/workspace_monitor.js | CLI | SISTEMA ONE | JavaScript (UI) | PRECISA REFATORACAO |
| tools/llm_health_check.py | AUD | SISTEMA_ONE | Python | PRONTO PARA REUSO |
| tools/test_llm_router.py | AUD | SISTEMA_ONE | Python | PRONTO PARA REUSO |
| 09_TESTS/sovereign_auditor_suite.py | AUD | SISTEMA_ONE | Python (forense) | PRONTO PARA REUSO |
| 09_TESTS/diagnose_ecosystem.py | AUD | SISTEMA_ONE | Python | PRONTO PARA REUSO |
| 09_TESTS/forensic_llm_governance_v3.py | AUD | SISTEMA_ONE | Python | PRONTO PARA REUSO |
| 09_TESTS/cancel_all_missions.py | CLI | SISTEMA_ONE | Python | PRECISA REFATORACAO |
| 09_TESTS/mark_completed_missions.py | CLI | SISTEMA_ONE | Python | PRECISA REFATORACAO |
| tools/verify_conversation_sync_036.py | AUD | SISTEMA_ONE | Python | OBSOLETO (verificador de fase) |
| tools/verify_executive_copilot_sync_033.py | AUD | SISTEMA_ONE | Python | OBSOLETO (verificador de fase) |
| tools/verify_orchestration_sync_034.py | AUD | SISTEMA_ONE | Python | OBSOLETO (verificador de fase) |
| tools/verify_runtime_awareness_sync_035.py | AUD | SISTEMA_ONE | Python | OBSOLETO (verificador de fase) |
| (núcleo 01_CORE: copilot_kernel, executive_router, governance_engine, mission_manager, mission_state_machine, bridge_engine, llm_router — compilados .pyc) | ENG/ORQ | SISTEMA_ONE | Python 3.11 | PRONTO PARA REUSO |

### 2.9 E:\Sistema_open_claude (origem canônica)

| Nome | Tipo | Origem | Tecnologia | Classificação |
|---|---|---|---|---|
| iniciar_tudo.bat | LCH | Open Claude | Batch (14 processos) | PRECISA REFATORACAO |
| iniciar_backend.bat / iniciar_whatsapp.bat / iniciar_whatsapp_agente.bat / iniciar.bat | LCH | Open Claude | Batch | OBSOLETO |
| Agente X/COMMIT_M6-M9.bat | LCH | Open Claude | Batch | OBSOLETO |
| Agente X/10_GITHUB/git_save.bat | LCH | Open Claude | Batch | OBSOLETO (duplicata) |
| Agente X/13_BACKUPS_DIARIOS/BACKUP_DIARIO.bat | LCH | Open Claude | Batch | OBSOLETO (duplicata) |
| Orquestrador/auto_sync.py | CLI | Open Claude | Python/Git | PRECISA REFATORACAO |
| Orquestrador/chat.py | API | Open Claude | Python (interface) | PRECISA REFATORACAO |
| Backend/servidor.py | API | Open Claude | Flask/FastAPI | PRECISA REFATORACAO |
| WhatsApp/servidor.js | API | Open Claude | Node.js/whatsapp-web.js | PRECISA REFATORACAO |
| Agente X/agente_x.py | ORQ | Open Claude | Python (duplicata Agente X) | OBSOLETO (duplicata) |
| Agente X/03_RUNTIME/maestro.py | ORQ | Open Claude | Python (duplicata) | OBSOLETO (duplicata) |
| Agente X/setup_agente_x.py | CLI | Open Claude | Python (duplicata) | OBSOLETO (duplicata) |
| Agente X/agente_diagnostico.py | AUD | Open Claude | Python (duplicata) | OBSOLETO (duplicata) |
| Agente X/01_TESTS/phase1_certifier.py | AUD | Open Claude | Python | PRECISA REFATORACAO |
| Agente X/01_CORE/orchestrator/react_engine.py | ENG | Open Claude | Python (ReAct) | PRONTO PARA REUSO |
| Agente X/01_CORE/orchestrator/llm_router.py | ENG | Open Claude | Python (multi-LLM) | PRONTO PARA REUSO |
| Agente X/01_CORE/orchestrator/learning_loop.py | ENG | Open Claude | Python | PRECISA REFATORACAO |
| Agente X/10_GITHUB/save_manager.py | CLI | Open Claude | Python/Git (duplicata) | OBSOLETO (duplicata) |
| Agente X/10_GITHUB/daily_report_generator.py | CLI | Open Claude | Python (duplicata) | OBSOLETO (duplicata) |

> Observação de genealogia: `E:\Agente X` é a versão extraída/promovida do `Agente X` aninhado em `E:\Sistema_open_claude\Agente X`. A versão de raiz (`E:\Agente X`) é a canônica para reuso; a aninhada é duplicata.

> **E:\BLESSED não contém executáveis de runtime de infraestrutura** (é front-end React via CDN, localStorage, sem backend/agentes/scripts). Excluído da contagem de executáveis — apenas o pattern de Store/localStorage e o design system têm valor, mas não como componente executável.

---

## 3. Análise dos Componentes PRONTOS PARA REUSO

Os componentes abaixo são genéricos, testados (com evidência de execução real: `.pyc` compilados, bancos SQLite populados, logs reais) e desacoplados o suficiente para importação direta na Fábrica de Sistemas.

### 3.1 Núcleo de Governança e Segurança (alto valor)
- **SafeGate** (3 implementações convergentes: `NEXUSPREMIUM/core/executor/safe_gate.py`, `Nexus_Claude/Core/safe_gate.py`, `PHANDORA/01_CORE/brain/safe_gate.py`, `Agente X/00_GOVERNANCE/safe_gate.py`). A versão NEXUSPREMIUM é a mais avançada — classificação automática de risco LOW/MEDIUM/HIGH/PROIBIDO com listas de extensões e caminhos proibidos. **Recomendação:** adotar como gate padrão da Fábrica.
- **Stack de segurança PHANDORA** (`prompt_injection_guard`, `filesystem_guard`, `credential_guard`) — conjunto coeso e raro de guards prontos.
- **Pipeline OGV** (`PHANDORA/01_CORE/pipeline/observe_ground_verify.py`) — Observe-Ground-Verify obrigatório antes de qualquer resposta; alinhado diretamente à Zero Ghost Law da Fábrica.
- **Suite forense** (`integrity_checker.py` SHA-256, `placeholder_hunter.py`, `forensic_self_audit_engine.py`, `sovereign_auditor_suite.py`) — kit completo de auditoria reaproveitável.

### 3.2 Roteamento de LLM e controle de custo (alto valor)
- **model_router.py / llm_router.py / nexus_router_economia.py** — roteamento cost-aware com cascata de fallback (Ollama local > barato > pago). A versão SISTEMA_ONE (5-provider: DeepSeek > Gemini > OpenAI > Ollama, com TaskClassifier + ComplexityEngine + PrivacyEngine + cost gate) é production-grade.
- **budget_guard.py** (Nexus_Claude, BRL) e **billing_guard.py** (PHANDORA, $1/dia) — circuit breakers financeiros com reset diário.
- **llm_factory.py** (factory pattern multi-provedor) — padrão limpo para instanciar qualquer cliente LLM.

### 3.3 Cofre de credenciais
- **api_vault.py** (NIVEL 1 e NEXUSPREMIUM) + **adicionar_chave.py** — cofre SQLite que substitui `.env` em texto plano. **Crítico:** deve ser adotado para resolver as múltiplas exposições de credenciais detectadas (ver seção 4).

### 3.4 Runtime e orquestração
- **phandora_runtime.py** + `heartbeat_engine` + `watchdog` + `scheduler_engine` + `queue_manager` — runtime 24/7 com auto-recuperação completo e modular.
- **sinfonia_nexus.py** (NEXUSPREMIUM) — orquestrador com ThreadPoolExecutor + Pydantic, dependências entre etapas; o melhor orquestrador paralelo do legado.
- **cognitive_pipeline.py** (5 fases PLANEJAR>DECIDIR>EXECUTAR>VALIDAR>RELATAR) e **base_nexus_manager.py** — padrões de agente reaproveitáveis.
- **react_engine.py** + **maestro.py** (Agente X) — ciclo ReAct + daemon 24/7 com evidência de uso real.

### 3.5 Integração MCP
- **nexus_mcp_server.py** (NIVEL 1 e NEXUSPREMIUM) — bridge MCP funcional expondo 11 ferramentas para Claude Code/Desktop. Diretamente alinhado ao ecossistema MCP da Fábrica.

### 3.6 Memória
- **memory_manager / classifier / consolidator / retrieval / health** (PHANDORA) — pipeline de memória em camadas completo.
- **hermes_core.py / memoria_engine.py / skills_engine.py** (Open Claude) — núcleo de aprendizado/skills portável.

### 3.7 Testes de resiliência
- **burnin_stress_injector.py / death_test_final.py / burnin_mission_043_5b.py** (ZEUS) — cultura de chaos engineering com pareceres técnicos; reaproveitáveis como suite de stress da Fábrica.

---

## 4. Componentes que PRECISAM REFATORAÇÃO (e por quê)

### 4.1 Credenciais expostas (BLOQUEADOR de segurança)
- `E:\LDCODE\server.js` — **TELEGRAM_BOT_TOKEN e CHAT_ID hardcoded** no código-fonte.
- `.env` em **Antigravity**, **NIVEL 3 ANTIGRAVITY** (10+ chaves: Gemini, Claude, OpenAI, Groq, Grok, OpenRouter, DeepSeek, Together, Voyage, Canva) e **Sistema_open_claude** (6 provedores).
- **Por quê refatorar:** todas as chaves devem ser consideradas comprometidas, rotacionadas, e migradas para `api_vault.py` (SQLite). Nenhum desses componentes deve ser reusado antes da extração de segredos.

### 4.2 Paths hardcoded / não-portabilidade
- Família **Antigravity/AMYGO/NEXUS_OS/nexus_brain/migrate_to_d** — paths fixos `C:\Users\conta\` e `D:\DATASTORE\Nexus_Core\`. Não-portáveis e single-user.
- **NEXUSPREMIUM** referencia banco obrigatório `D:\NEXUSPREMIUM\data\nexus.db` e vault em path fixo.
- **SISTEMA_ONE** carrega `.env` de `D:\BIBLIOTECA_COMPLEXO_ZEUS\91_CONFIGS\.env`.
- **Por quê refatorar:** exigir configuração via variáveis de ambiente / arquivo de config relativo antes de importar para a Fábrica.

### 4.3 Encoding quebrado
- Múltiplos `.py` de Antigravity e NIVEL 3 têm **UTF-8 corrompido**. Refatoração de encoding obrigatória antes de qualquer reuso.

### 4.4 Implementações mock / cadeias incompletas
- **PHANDORA**: `hallucination_guard` não conectado ao `CognitiveEngine`; `AuditCI` sem hashing real; `EvidenceCollector` vazio (admitido no PHANDORA_OPERATIONAL_MAP.md). Os componentes são bem desenhados, mas a fiação interna precisa ser completada.
- **NEXUSPREMIUM**: sistema em ALERTA_DERIVA (QScore 0.73), modelos Claude em status vermelho por falta de chave — depende de configuração externa.
- **Antigravity SINFONIA**: orquestrador é stub sem dispatch real.

### 4.5 Servidores acoplados ao projeto-fonte
- `Backend/servidor.py`, `WhatsApp/servidor.js`, `whatsapp_agent.py`, `monitor_backend.py`, `chat.py`, `ZEUS_TASK_SAAS/app.py`, `LDCODE/server.js` — funcionam, mas estão acoplados a portas fixas, estruturas de pastas e lógica específica do projeto. Refatorar para configuração injetável e desacoplamento do core.

### 4.6 Scripts de sincronização e fixes pontuais
- `auto_sync.py`, `sincronizacao.py`, `sync_guard.ps1`, `verify_sync.ps1` — úteis, mas amarrados a repositórios GitHub e estruturas específicas (treinamentocipolari/SISTEMA-ONE). Generalizar.
- `fix_monitor_bloqueio.py`, `zeus_brain_fix.py` — patches pontuais de uma situação passada; baixo valor, refatorar apenas se a lógica subjacente for útil.

### 4.7 Scripts gerados / managers por agente
- `managers/O_*/run.py` (NEXUSPREMIUM), `_gerar_agentes.py`, `forjar_todas_equipes.py`, `gerar_run_py.py` — seguem template padronizado (valioso), mas geram runners repetitivos. Refatorar para um runtime único parametrizado em vez de 23 cópias de `run.py`.

---

## 5. Componentes OBSOLETOS (descartar / não reusar)

- **Binários .exe** (Antigravity_MASTER 218MB, AMIGO 210MB, INSTALAR_AMYGO, Antigravity.exe) — forks de VSCode/VSCodium rebrandeados; sem valor de runtime para a Fábrica e enorme footprint.
- **Batches de commit por missão** (COMMIT_M6/M7/M8/M9.bat) — específicos de missões já concluídas.
- **Launchers de start** específicos por projeto (iniciar*.bat, START_*.bat, INICIAR_WHATSAPP.bat, start_nexus.bat) — substituíveis por orquestração unificada.
- **Verificadores de sync por fase** (verify_*_sync_033/034/035/036.py) — verificadores de marcos de desenvolvimento já passados.
- **Scripts de migração one-shot** (migrate_to_d.py, migrate_system.py, resgatar_nexuspremium.py, iniciar_missao_fase_5.py) — tarefas únicas concluídas.
- **Duplicatas integrais**: NIVEL 3 ANTIGRAVITY (3 cópias do mesmo sistema), Antigravity (cópia), Agente X aninhado em Sistema_open_claude, SISTEMA ONE (com espaço) vs SISTEMA_ONE, cópias da Biblioteca (PHANDORA/Open Claude/SISTEMA ONE). Manter apenas a origem canônica de cada.
- **api/save.php / demo_mode.py / NEXUS_ULTIMATE.py / amigo_app.py** — legado pontual ou demo.

---

## 6. Recomendações Consolidadas para a Fábrica

1. **Adotar como padrões-base:** SafeGate (NEXUSPREMIUM), api_vault (SQLite), LLM Router 5-provider (SISTEMA_ONE), Pipeline OGV (PHANDORA), runtime+watchdog (PHANDORA), nexus_mcp_server (MCP bridge).
2. **Ação de segurança imediata:** rotacionar todas as chaves expostas e remover o token Telegram de LDCODE antes de qualquer importação.
3. **Deduplicar:** eleger origens canônicas (E:\PHANDORA, E:\Agente X, E:\NEXUSPREMIUM, E:\NIVEL 1\...\Nexus_Claude, E:\SISTEMA_ONE) e ignorar as réplicas.
4. **Completar cadeias mock** da PHANDORA antes de promover seus guards cognitivos a produção.
5. **Descartar** os 6 binários .exe e os launchers/batches específicos.

---

## TOTAL_EXECUTAVEIS: 187
