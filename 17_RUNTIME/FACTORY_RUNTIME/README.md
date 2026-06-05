# FACTORY_RUNTIME

Ponto unico de entrada operacional da Fabrica de Sistemas.  
Executa o pipeline completo de um projeto com um unico comando.

---

## Arquivos

| Arquivo | Funcao |
|---|---|
| `factory_runtime.ps1` | Entry point. Orquestra todas as etapas do pipeline. |
| `runtime_config.ps1` | Define todos os caminhos canonicos da Fabrica. Dot-sourced. |
| `runtime_logger.ps1` | Gerencia o RUNTIME_LOG.md. Dot-sourced. |
| `runtime_validator.ps1` | Valida pre-condicoes antes de executar. Dot-sourced. |
| `RUNTIME_LOG.md` | Log tabular de todas as execucoes (criado automaticamente). |

---

## Como usar

### Pipeline completo de um projeto

```powershell
.\factory_runtime.ps1 -ProjectName "NOME_DO_PROJETO"
```

### Forcar re-orquestracao mesmo com MISSION_BOARD existente

```powershell
.\factory_runtime.ps1 -ProjectName "NOME_DO_PROJETO" -ForceOrchestrate
```

### Executar sem gerar relatorio final

```powershell
.\factory_runtime.ps1 -ProjectName "NOME_DO_PROJETO" -NoReport
```

---

## Pipeline executado

```
factory_runtime.ps1
  |
  1. VALIDACAO
  |    - Projeto existe em 15_PROJETOS?
  |    - README.md presente?
  |    - Todos os motores disponiveis?
  |
  2. ORCHESTRATOR (ou SKIP se ja orquestrado)
  |    - Executa orchestrate.ps1
  |    - Gera MISSION_BOARD e task files
  |
  3. MISSION_EXECUTOR
  |    - Le MISSION_BOARD
  |    - Despacha agentes pendentes
  |    - Atualiza status: AGUARDANDO -> EM EXECUCAO
  |
  4. STATUS_ENGINE
  |    - Escaneia o projeto
  |    - Atualiza FACTORY_STATUS_DASHBOARD.md
  |
  5. AUDIT_ENGINE
       - Audita consistencia do projeto
       - Gera FACTORY_AUDIT_REPORT.md
       - Retorna score e veredicto
```

---

## Saidas geradas

| Arquivo | Localizacao |
|---|---|
| `RUNTIME_LOG.md` | 17_RUNTIME\FACTORY_RUNTIME\ |
| `FACTORY_RUNTIME_EXECUTION_REPORT.md` | 19_RELATORIOS\ |
| `FACTORY_STATUS_DASHBOARD.md` | 19_RELATORIOS\ (atualizado) |
| `FACTORY_AUDIT_REPORT.md` | 19_RELATORIOS\ (atualizado) |

---

## Comportamento do ORCHESTRATOR

| Situacao | Comportamento |
|---|---|
| MISSION_BOARD ausente | Executa orchestrate.ps1 |
| MISSION_BOARD presente | SKIP (ja orquestrado) |
| MISSION_BOARD presente + -ForceOrchestrate | Executa com -Force |
| orchestrate.ps1 com path D:\ incompativel | Log como SKIP_PATH_MISMATCH, continua pipeline |

---

## Zero Ghost Law

O runtime nao simula nenhuma execucao.  
Cada etapa chama o script real do motor correspondente.  
Resultados refletem apenas o que os motores realmente produziram.
