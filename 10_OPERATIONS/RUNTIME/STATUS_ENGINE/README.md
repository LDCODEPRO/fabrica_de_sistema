# STATUS_ENGINE

Motor de status da Fabrica de Sistemas.  
Escaneia todos os projetos em `15_PROJETOS`, consolida os dados de status e gera o dashboard unificado.

---

## Arquivos

| Arquivo | Funcao |
|---|---|
| `status_engine.ps1` | Entry point. Orquestra a leitura e geracao do dashboard. |
| `project_status_reader.ps1` | Le um projeto e retorna seus dados como JSON. |
| `status_dashboard_generator.ps1` | Recebe o JSON consolidado e gera `FACTORY_STATUS_DASHBOARD.md`. |

---

## Como usar

### Gerar dashboard de todos os projetos

```powershell
.\status_engine.ps1
```

### Escanear apenas um projeto

```powershell
.\status_engine.ps1 -ProjectName "PROJETO_002_TESTE_SAAS"
```

### Customizar caminhos

```powershell
.\status_engine.ps1 `
    -ProjectsRoot "C:\...\15_PROJETOS" `
    -DashboardPath "C:\...\19_RELATORIOS\FACTORY_STATUS_DASHBOARD.md"
```

---

## Fluxo interno

```
status_engine.ps1
  |
  |- Descobre pastas em 15_PROJETOS
  |
  |- project_status_reader.ps1 (por projeto)
  |    Retorna JSON com:
  |    - Status do MISSION_BOARD
  |    - Lista de agentes e status
  |    - Task files (status, pendentes, concluidas)
  |    - Ultimo log
  |    - Registros de _DISPATCH_LOG
  |
  |- status_dashboard_generator.ps1
       Consolida todos os JSONs e gera:
       19_RELATORIOS/FACTORY_STATUS_DASHBOARD.md
```

---

## Saida: FACTORY_STATUS_DASHBOARD.md

Contém:

- Resumo geral (totais, bloqueios, agentes ativos)
- Projetos por status
- Detalhe de cada projeto (MISSION_BOARD + task files)
- Agentes ativos (EM EXECUCAO)
- Tarefas por status
- Ultimos logs do MISSION_EXECUTOR
- Bloqueios encontrados
- Proxima acao recomendada

---

## Integração com MISSION_EXECUTOR

O STATUS_ENGINE le automaticamente o `STATUS_LOG.md` do MISSION_EXECUTOR  
em `17_RUNTIME\MISSION_EXECUTOR\STATUS_LOG.md` (se existir) e inclui  
as ultimas 5 entradas no dashboard.

---

## Zero Ghost Law

Todos os dados do dashboard vêm de arquivos reais existentes no disco.  
Nenhum projeto, agente ou status é inventado.
