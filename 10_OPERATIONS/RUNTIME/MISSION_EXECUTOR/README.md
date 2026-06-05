# MISSION_EXECUTOR

Componente de execução real da Fábrica de Sistemas.  
Recebe projetos gerados pelo PROJECT_ORCHESTRATOR, lê as tarefas e atualiza os status.

---

## Arquivos

| Arquivo | Função |
|---|---|
| `mission_executor.ps1` | Entry point. Lê MISSION_BOARD, identifica tarefas pendentes e aciona o dispatcher. |
| `workflow_runner.ps1` | Varre a pasta de projetos e executa o executor para cada projeto pendente. |
| `agent_dispatcher.ps1` | Valida o arquivo de tarefa, extrai metadados e grava o registro de despacho. |
| `status_updater.ps1` | Atualiza o campo `## Status` em task files e a célula correspondente no MISSION_BOARD. |
| `STATUS_LOG.md` | Log tabular de todas as transições de status (criado automaticamente). |

---

## Como usar

### Executar um projeto específico

```powershell
.\mission_executor.ps1 -ProjectPath "C:\...\15_PROJETOS\PROJETO_002_TESTE_SAAS"
```

### Executar todos os projetos pendentes

```powershell
.\workflow_runner.ps1
```

### Dry-run (ver o que seria executado sem modificar nada)

```powershell
.\workflow_runner.ps1 -DryRun
```

### Executar apenas um projeto via workflow_runner

```powershell
.\workflow_runner.ps1 -ProjectName "PROJETO_002_TESTE_SAAS"
```

---

## Fluxo interno

```
workflow_runner.ps1
  └─ Descobre projetos com MISSION_BOARD pendente
       └─ mission_executor.ps1 (por projeto)
            ├─ Lê MISSION_BOARD.md
            ├─ Para cada agente com status AGUARDANDO:
            │    ├─ agent_dispatcher.ps1  → grava _DISPATCH_LOG/<AGENT>_dispatch.txt
            │    └─ status_updater.ps1   → AGUARDANDO → EM EXECUCAO
            └─ Append em STATUS_LOG.md
```

---

## Formato esperado nos projetos

**MISSION_BOARD.md** — tabela de agentes:

```markdown
| Agente              | Missao            | Status     |
|---------------------|-------------------|------------|
| ARCHITECT_AGENT     | ARCHITECT_TASK.md | AGUARDANDO |
| DEVELOPER_AGENT     | DEVELOPER_TASK.md | AGUARDANDO |
```

**\*_TASK.md** — bloco de status:

```markdown
## Status

AGUARDANDO
```

---

## Status reconhecidos

| Status | Significado |
|---|---|
| `AGUARDANDO` | Tarefa pendente, será despachada |
| `EM EXECUCAO` | Despachada nesta rodada |
| `CONCLUIDO` | Tarefa encerrada, ignorada pelo executor |

---

## Zero Ghost Law

Nenhum arquivo é criado sem conteúdo real.  
Nenhuma execução é simulada.  
Todos os arquivos gerados (`STATUS_LOG.md`, `_DISPATCH_LOG/*.txt`) contêm dados reais da execução.
