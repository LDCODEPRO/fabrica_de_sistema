# PROJECT_ORCHESTRATOR V1

Sistema de orquestração da FÁBRICA DE SISTEMAS. Recebe projetos criados pela PROJECT_FACTORY_CLI e gera automaticamente missões por agente.

## Uso

```powershell
# Modo interativo (selecionar projeto via menu)
.\orchestrate.ps1

# Modo direto
.\orchestrate.ps1 -ProjectName PROJETO_002_TESTE_SAAS

# Forçar regeneração de missões
.\orchestrate.ps1 -ProjectName PROJETO_002_TESTE_SAAS -Force
```

## O que é gerado

| Arquivo           | Agente responsável    | Condição          |
|-------------------|-----------------------|-------------------|
| MISSION_BOARD.md  | — (sempre)            | Sempre gerado     |
| ANALYST_TASK.md   | ANALYST_AGENT         | Se atribuído      |
| ARCHITECT_TASK.md | ARCHITECT_AGENT       | Se atribuído      |
| DEVELOPER_TASK.md | DEVELOPER_AGENT       | Se atribuído      |
| QA_TASK.md        | QA_AGENT              | Se atribuído      |
| DOCS_TASK.md      | DOCS_AGENT            | Se atribuído      |
| DESIGNER_TASK.md  | SITE_DESIGNER         | Se atribuído      |

## Workflow

```
PROJETO CRIADO (PROJECT_FACTORY_CLI)
        ↓
ORCHESTRATOR (lê README.md)
        ↓
MISSÕES GERADAS (por agente)
        ↓
AGENTES DESIGNADOS (executam suas tarefas)
        ↓
EXECUÇÃO DO PROJETO
```

## Estrutura

```
PROJECT_ORCHESTRATOR/
├── orchestrate.ps1     ← script principal
├── README.md           ← este arquivo
└── templates/          ← templates futuros (V2)
```

## Versão

V1 — 2026-06-04
