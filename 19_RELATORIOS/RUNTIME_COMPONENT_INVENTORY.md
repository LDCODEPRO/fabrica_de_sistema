# RUNTIME COMPONENT INVENTORY

**Data:** 2026-06-04
**Auditoria:** FACTORY_RUNTIME_V1_FINAL_AUDIT

---

## Componentes do Runtime (17_RUNTIME)

### FACTORY_RUNTIME

| Arquivo | Tipo | Funcao |
|---|---|---|
| `factory_runtime.ps1` | Script executavel | Ponto unico de entrada do pipeline |
| `runtime_config.ps1` | Modulo dot-source | Caminhos canonicos e verificacao de motores |
| `runtime_logger.ps1` | Modulo dot-source | Logger tabular com retry para RUNTIME_LOG.md |
| `runtime_validator.ps1` | Modulo dot-source | Pre-flight checks de projeto e motores |
| `RUNTIME_LOG.md` | Log gerado | Historico tabular de execucoes |
| `README.md` | Documentacao | Uso, fluxo e comportamento |
| `FACTORY_RUNTIME_REPORT.md` | Relatorio | Relatorio de criacao do componente |

**Dependencias:** runtime_config, runtime_logger, runtime_validator (dot-sourced)  
**Chama:** mission_executor.ps1, status_engine.ps1, audit_engine.ps1, orchestrate.ps1

---

### MISSION_EXECUTOR

| Arquivo | Tipo | Funcao |
|---|---|---|
| `mission_executor.ps1` | Script executavel | Le MISSION_BOARD e despacha tarefas |
| `workflow_runner.ps1` | Script executavel | Varre 15_PROJETOS e aciona o executor |
| `agent_dispatcher.ps1` | Script executavel | Valida task file e grava _DISPATCH_LOG |
| `status_updater.ps1` | Script executavel | Atualiza status em task files e MISSION_BOARD |
| `STATUS_LOG.md` | Log gerado | Historico de transicoes de status |
| `README.md` | Documentacao | Uso e fluxo |
| `MISSION_EXECUTOR_REPORT.md` | Relatorio | Relatorio de criacao do componente |

**Dependencias:** agent_dispatcher.ps1, status_updater.ps1 (chamados diretamente)

---

### STATUS_ENGINE

| Arquivo | Tipo | Funcao |
|---|---|---|
| `status_engine.ps1` | Script executavel | Escaneia projetos e gera dashboard |
| `project_status_reader.ps1` | Script executavel | Le um projeto e retorna JSON de status |
| `status_dashboard_generator.ps1` | Script executavel | Gera FACTORY_STATUS_DASHBOARD.md |
| `README.md` | Documentacao | Uso e fluxo |
| `STATUS_ENGINE_REPORT.md` | Relatorio | Relatorio de criacao do componente |

**Dependencias:** project_status_reader.ps1, status_dashboard_generator.ps1  
**Gera:** 19_RELATORIOS\FACTORY_STATUS_DASHBOARD.md

---

### AUDIT_ENGINE

| Arquivo | Tipo | Funcao |
|---|---|---|
| `audit_engine.ps1` | Script executavel | Escaneia projetos e gera relatorio de auditoria |
| `project_auditor.ps1` | Script executavel | Orquestra os 3 sub-auditores por projeto |
| `mission_board_auditor.ps1` | Script executavel | Valida MISSION_BOARD |
| `task_file_auditor.ps1` | Script executavel | Valida task files dos agentes |
| `log_consistency_auditor.ps1` | Script executavel | Valida STATUS_LOG, dispatch logs e dashboard |
| `README.md` | Documentacao | Uso, codigos de issue e scoring |
| `AUDIT_ENGINE_REPORT.md` | Relatorio | Relatorio de criacao e correcoes |

**Dependencias:** project_auditor, mission_board_auditor, task_file_auditor, log_consistency_auditor  
**Gera:** 19_RELATORIOS\FACTORY_AUDIT_REPORT.md

---

### CORE_ASSETS (referencia)

| Arquivo | Conteudo |
|---|---|
| DOSSIE_01_ZERO_GHOST_LAW.md | Lei Zero Ghost |
| DOSSIE_02_RULES_000_013.md | Regras 000-013 |
| DOSSIE_03_GOVERNANCE_ENGINE.md | Motor de governanca |
| DOSSIE_04_SAFE_GATE.md | Gate de seguranca |
| DOSSIE_05_HALLUCINATION_GUARD.md | Guarda de alucinacao |
| DOSSIE_06_API_VAULT.md | Cofre de APIs |
| DOSSIE_07_REACT_ENGINE.md | Motor React |
| DOSSIE_08_PIPELINE_5_FASES.md | Pipeline 5 fases |
| DOSSIE_09_LLM_ROUTER_UNIFICADO.md | Router LLM |
| DOSSIE_10_TEMPLATE_AGENTE_12_ARQUIVOS.md | Template de agente |
| DOSSIE_11_MEMORIA_3_CAMADAS.md | Memoria 3 camadas |

---

## Sistemas de Suporte (16_SISTEMAS)

| Sistema | Entry Point | Status |
|---|---|---|
| PROJECT_FACTORY_CLI | `create-project.ps1` | Operacional |
| PROJECT_ORCHESTRATOR | `orchestrate.ps1` | Operacional (path D:\ hardcoded — risco conhecido) |
| PROJECT_INTAKE_SYSTEM | (a verificar) | Existente |

---

## Totais

| Categoria | Quantidade |
|---|---|
| Scripts executaveis (.ps1) | 19 |
| Modulos dot-source | 3 |
| Arquivos de documentacao/relatorio | 17 |
| Logs gerados automaticamente | 2 |
| Dossies de referencia | 11 |
| **Total de arquivos em 17_RUNTIME** | **39** |

---

## Mapa de Dependencias

```
factory_runtime.ps1
  |-- runtime_config.ps1        (dot-source)
  |-- runtime_logger.ps1        (dot-source)
  |-- runtime_validator.ps1     (dot-source)
  |
  |-- orchestrate.ps1           (16_SISTEMAS/PROJECT_ORCHESTRATOR)
  |-- mission_executor.ps1      (MISSION_EXECUTOR)
  |     |-- agent_dispatcher.ps1
  |     |-- status_updater.ps1
  |
  |-- status_engine.ps1         (STATUS_ENGINE)
  |     |-- project_status_reader.ps1
  |     |-- status_dashboard_generator.ps1
  |
  |-- audit_engine.ps1          (AUDIT_ENGINE)
        |-- project_auditor.ps1
              |-- mission_board_auditor.ps1
              |-- task_file_auditor.ps1
              |-- log_consistency_auditor.ps1
```
