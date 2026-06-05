# AUDIT_ENGINE

Motor de auditoria operacional da Fabrica de Sistemas.  
Valida a consistencia do fluxo completo: MISSION_BOARD, task files, logs e dashboard.

---

## Arquivos

| Arquivo | Funcao |
|---|---|
| `audit_engine.ps1` | Entry point. Escaneia projetos, chama project_auditor e gera o relatorio. |
| `project_auditor.ps1` | Orquestra a auditoria de um projeto chamando os 3 sub-auditores. |
| `mission_board_auditor.ps1` | Valida estrutura e consistencia do MISSION_BOARD.md. |
| `task_file_auditor.ps1` | Valida task files dos agentes contra o MISSION_BOARD. |
| `log_consistency_auditor.ps1` | Valida STATUS_LOG, _DISPATCH_LOG e FACTORY_STATUS_DASHBOARD. |

---

## Como usar

### Auditar todos os projetos

```powershell
.\audit_engine.ps1
```

### Auditar apenas um projeto

```powershell
.\audit_engine.ps1 -ProjectName "PROJETO_002_TESTE_SAAS"
```

### Customizar caminhos

```powershell
.\audit_engine.ps1 `
    -ProjectsRoot "C:\...\15_PROJETOS" `
    -ReportPath   "C:\...\19_RELATORIOS\FACTORY_AUDIT_REPORT.md"
```

---

## Fluxo interno

```
audit_engine.ps1
  |
  |- Descobre projetos em 15_PROJETOS
  |
  |- project_auditor.ps1 (por projeto)
  |    |
  |    |- mission_board_auditor.ps1
  |    |    - MISSION_BOARD existe?
  |    |    - Campos obrigatorios presentes?
  |    |    - Status valido?
  |    |    - Tabela de agentes presente?
  |    |
  |    |- task_file_auditor.ps1
  |    |    - Task file existe para cada agente?
  |    |    - Arquivos vazios?
  |    |    - Status bate com MISSION_BOARD?
  |    |    - Agente CONCLUIDO com tarefas pendentes?
  |    |
  |    |- log_consistency_auditor.ps1
  |         - STATUS_LOG existe e tem entradas?
  |         - _DISPATCH_LOG existe para o projeto?
  |         - FACTORY_STATUS_DASHBOARD reconhece o projeto?
  |
  |- Calcula score e veredicto por projeto
  |- Gera 19_RELATORIOS/FACTORY_AUDIT_REPORT.md
```

---

## Veredictos

| Veredicto | Criterio |
|---|---|
| APROVADO | Score >= 80, sem issues HIGH ou CRITICAL |
| ALERTA | Score entre 40-79, ou issues MEDIUM/HIGH |
| REPROVADO | Qualquer issue CRITICAL, ou score < 40 |

## Scoring

| Severidade | Desconto |
|---|---|
| CRITICAL | -25 pontos |
| HIGH | -15 pontos |
| MEDIUM | -8 pontos |
| LOW | -3 pontos |

---

## Codigos de Issue

| Codigo | Severidade | Descricao |
|---|---|---|
| MB001 | CRITICAL | MISSION_BOARD.md ausente |
| MB002 | CRITICAL | MISSION_BOARD.md vazio |
| MB003 | MEDIUM | Campo obrigatorio ausente no MISSION_BOARD |
| MB004 | HIGH | Status do projeto nao encontrado |
| MB005 | MEDIUM | Status invalido no MISSION_BOARD |
| MB006 | HIGH | Tabela de agentes ausente |
| MB007 | MEDIUM | Agente com status invalido |
| MB008 | LOW | Secao de log de orquestracao ausente |
| TF002 | HIGH | Task file ausente para agente atribuido |
| TF003 | HIGH | Task file vazio |
| TF004 | MEDIUM | Status invalido no task file |
| TF005 | MEDIUM | Divergencia de status entre MISSION_BOARD e task file |
| TF006 | MEDIUM | Agente CONCLUIDO com subtarefas pendentes |
| TF007 | LOW | Task file sem nenhuma subtarefa definida |
| LC001 | LOW | STATUS_LOG sem entradas |
| LC002 | LOW | STATUS_LOG nao encontrado |
| LC003 | LOW | _DISPATCH_LOG sem arquivos |
| LC004 | LOW | Arquivo de dispatch vazio |
| LC005 | LOW | _DISPATCH_LOG nao encontrado |
| LC006 | MEDIUM | Projeto nao encontrado no dashboard |
| LC007 | LOW | Dashboard sem campo de data |
| LC008 | MEDIUM | FACTORY_STATUS_DASHBOARD nao encontrado |

---

## Zero Ghost Law

Todos os dados do relatorio sao lidos de arquivos reais.  
Nenhum projeto, agente ou status e inventado ou assumido.  
O AUDIT_ENGINE apenas le, compara e reporta — nunca corrige.
