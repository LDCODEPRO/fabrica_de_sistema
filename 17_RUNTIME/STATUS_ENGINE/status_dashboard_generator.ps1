# =============================================================================
# STATUS_DASHBOARD_GENERATOR.PS1
# Fabrica de Sistemas - Runtime Component
# Recebe array JSON de projetos (lido pelo project_status_reader) e gera
# o arquivo FACTORY_STATUS_DASHBOARD.md em 19_RELATORIOS.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectsJson,       # JSON serializado do array de projetos

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,         # Caminho completo do dashboard a gerar

    [string]$StatusLogPath = ""  # Opcional: caminho do STATUS_LOG do MISSION_EXECUTOR
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Parse
# ---------------------------------------------------------------------------
$projects = $ProjectsJson | ConvertFrom-Json

$now = Get-Date -Format "yyyy-MM-dd HH:mm"

# ---------------------------------------------------------------------------
# Metricas
# ---------------------------------------------------------------------------
$total      = $projects.Count
$withBoard  = @($projects | Where-Object { $_.HasMissionBoard -eq $true })
$noBoard    = @($projects | Where-Object { $_.HasMissionBoard -ne $true })

# Contagem por status
$statusGroups = @{}
foreach ($p in $withBoard) {
    $s = if ($p.Status) { $p.Status } else { "INDEFINIDO" }
    if ($statusGroups.ContainsKey($s)) { $statusGroups[$s]++ } else { $statusGroups[$s] = 1 }
}

# Projetos com bloqueios reais
$blocked = @($withBoard | Where-Object { $_.Blockers -and ($_.Blockers -ne "Nenhum") -and ($_.Blockers -ne "") })

# Agentes ativos (EM EXECUCAO)
$activeAgents = @()
foreach ($p in $withBoard) {
    if ($p.Agents) {
        foreach ($a in $p.Agents) {
            if ($a.Status -eq "EM EXECUCAO") {
                $activeAgents += [PSCustomObject]@{ Project = $p.Name; Agent = $a.Agent; Task = $a.TaskFile }
            }
        }
    }
}

# Tarefas por status (task files)
$taskStatusCounts = @{}
foreach ($p in $withBoard) {
    if ($p.Tasks) {
        foreach ($t in $p.Tasks) {
            if (-not $t.Exists) { continue }
            $s = if ($t.Status) { $t.Status } else { "INDEFINIDO" }
            if ($taskStatusCounts.ContainsKey($s)) { $taskStatusCounts[$s]++ } else { $taskStatusCounts[$s] = 1 }
        }
    }
}

# Total de subtarefas pendentes vs concluidas
$totalPending = 0; $totalDone = 0
foreach ($p in $withBoard) {
    if ($p.Tasks) {
        foreach ($t in $p.Tasks) {
            $totalPending += [int]$t.Pending
            $totalDone    += [int]$t.Done
        }
    }
}

# Proxima acao recomendada
$nextAction = "Nenhuma acao urgente identificada."
if ($blocked.Count -gt 0) {
    $nextAction = "ATENCAO: $($blocked.Count) projeto(s) com bloqueios. Verificar campo Bloqueios no MISSION_BOARD."
} elseif ($activeAgents.Count -gt 0) {
    $nextAction = "$($activeAgents.Count) agente(s) EM EXECUCAO. Monitorar conclusao e atualizar status para CONCLUIDO."
} elseif (($statusGroups["AGUARDANDO"] -gt 0) -or ($statusGroups["PENDENTE"] -gt 0)) {
    $nextAction = "Projetos aguardando execucao. Rodar mission_executor.ps1 ou workflow_runner.ps1."
}

# ---------------------------------------------------------------------------
# Ler STATUS_LOG do MISSION_EXECUTOR (ultimas 5 entradas)
# ---------------------------------------------------------------------------
$recentLogs = @()
if ($StatusLogPath -and (Test-Path $StatusLogPath)) {
    $logLines = Get-Content -Path $StatusLogPath -Encoding UTF8
    $dataLines = @($logLines | Where-Object { $_ -match '^\|\s*\d{4}-\d{2}-\d{2}' })
    $recentLogs = $dataLines | Select-Object -Last 5
}

# ---------------------------------------------------------------------------
# Montar dashboard
# ---------------------------------------------------------------------------
$sb = [System.Text.StringBuilder]::new()

$null = $sb.AppendLine("# FACTORY STATUS DASHBOARD")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("**Gerado em:** $now")
$null = $sb.AppendLine("**Motor:** STATUS_ENGINE_V1")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

# --- Resumo geral ---
$null = $sb.AppendLine("## Resumo Geral")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("| Metrica | Valor |")
$null = $sb.AppendLine("|---|---|")
$null = $sb.AppendLine("| Total de projetos | $total |")
$null = $sb.AppendLine("| Com MISSION_BOARD | $($withBoard.Count) |")
$null = $sb.AppendLine("| Sem MISSION_BOARD | $($noBoard.Count) |")
$null = $sb.AppendLine("| Projetos com bloqueios | $($blocked.Count) |")
$null = $sb.AppendLine("| Agentes ativos (EM EXECUCAO) | $($activeAgents.Count) |")
$null = $sb.AppendLine("| Subtarefas pendentes | $totalPending |")
$null = $sb.AppendLine("| Subtarefas concluidas | $totalDone |")
$null = $sb.AppendLine("")

# --- Projetos por status ---
$null = $sb.AppendLine("## Projetos por Status")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("| Status | Quantidade |")
$null = $sb.AppendLine("|---|---|")
foreach ($key in ($statusGroups.Keys | Sort-Object)) {
    $null = $sb.AppendLine("| $key | $($statusGroups[$key]) |")
}
if ($noBoard.Count -gt 0) {
    $null = $sb.AppendLine("| SEM_MISSION_BOARD | $($noBoard.Count) |")
}
$null = $sb.AppendLine("")

# --- Detalhe dos projetos ---
$null = $sb.AppendLine("## Detalhe dos Projetos")
$null = $sb.AppendLine("")
foreach ($p in $projects) {
    $null = $sb.AppendLine("### $($p.Name)")
    $null = $sb.AppendLine("")
    if (-not $p.HasMissionBoard) {
        $null = $sb.AppendLine("_Sem MISSION_BOARD. Projeto nao estruturado._")
        $null = $sb.AppendLine("")
        continue
    }
    $null = $sb.AppendLine("| Campo | Valor |")
    $null = $sb.AppendLine("|---|---|")
    $null = $sb.AppendLine("| Status | $($p.Status) |")
    $null = $sb.AppendLine("| Tipo | $($p.Type) |")
    $null = $sb.AppendLine("| Cliente | $($p.Client) |")
    $null = $sb.AppendLine("| Prioridade | $($p.Priority) |")
    $null = $sb.AppendLine("| Etapa Atual | $($p.CurrentStage) |")
    $null = $sb.AppendLine("| Proxima Etapa | $($p.NextStage) |")
    $null = $sb.AppendLine("| Bloqueios | $($p.Blockers) |")
    $null = $sb.AppendLine("| Criado em | $($p.CreatedAt) |")
    $null = $sb.AppendLine("")

    if ($p.Agents -and $p.Agents.Count -gt 0) {
        $null = $sb.AppendLine("**Agentes:**")
        $null = $sb.AppendLine("")
        $null = $sb.AppendLine("| Agente | Tarefa | Status |")
        $null = $sb.AppendLine("|---|---|---|")
        foreach ($a in $p.Agents) {
            $null = $sb.AppendLine("| $($a.Agent) | $($a.TaskFile) | $($a.Status) |")
        }
        $null = $sb.AppendLine("")
    }

    if ($p.Tasks -and $p.Tasks.Count -gt 0) {
        $existingTasks = @($p.Tasks | Where-Object { $_.Exists -eq $true })
        if ($existingTasks.Count -gt 0) {
            $null = $sb.AppendLine("**Task Files:**")
            $null = $sb.AppendLine("")
            $null = $sb.AppendLine("| Arquivo | Status | Pendentes | Concluidas |")
            $null = $sb.AppendLine("|---|---|---|---|")
            foreach ($t in $existingTasks) {
                $null = $sb.AppendLine("| $($t.File) | $($t.Status) | $($t.Pending) | $($t.Done) |")
            }
            $null = $sb.AppendLine("")
        }
    }

    if ($p.LastLogEntry) {
        $null = $sb.AppendLine("**Ultimo log:** $($p.LastLogEntry)")
        $null = $sb.AppendLine("")
    }
}

# --- Agentes ativos ---
$null = $sb.AppendLine("## Agentes Ativos")
$null = $sb.AppendLine("")
if ($activeAgents.Count -eq 0) {
    $null = $sb.AppendLine("_Nenhum agente em execucao no momento._")
} else {
    $null = $sb.AppendLine("| Projeto | Agente | Arquivo de Tarefa |")
    $null = $sb.AppendLine("|---|---|---|")
    foreach ($a in $activeAgents) {
        $null = $sb.AppendLine("| $($a.Project) | $($a.Agent) | $($a.Task) |")
    }
}
$null = $sb.AppendLine("")

# --- Tarefas por status ---
$null = $sb.AppendLine("## Tarefas por Status")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("| Status | Arquivos |")
$null = $sb.AppendLine("|---|---|")
foreach ($key in ($taskStatusCounts.Keys | Sort-Object)) {
    $null = $sb.AppendLine("| $key | $($taskStatusCounts[$key]) |")
}
$null = $sb.AppendLine("")

# --- Logs recentes do MISSION_EXECUTOR ---
$null = $sb.AppendLine("## Ultimos Logs do MISSION_EXECUTOR")
$null = $sb.AppendLine("")
if ($recentLogs.Count -eq 0) {
    $null = $sb.AppendLine("_Nenhum log encontrado ou STATUS_LOG nao disponivel._")
} else {
    $null = $sb.AppendLine("| Data/Hora | Agente | Tarefa | Status Anterior | Status Novo |")
    $null = $sb.AppendLine("|---|---|---|---|---|")
    foreach ($l in $recentLogs) {
        $null = $sb.AppendLine($l)
    }
}
$null = $sb.AppendLine("")

# --- Bloqueios ---
$null = $sb.AppendLine("## Bloqueios Encontrados")
$null = $sb.AppendLine("")
if ($blocked.Count -eq 0) {
    $null = $sb.AppendLine("_Nenhum bloqueio registrado._")
} else {
    $null = $sb.AppendLine("| Projeto | Bloqueio |")
    $null = $sb.AppendLine("|---|---|")
    foreach ($b in $blocked) {
        $null = $sb.AppendLine("| $($b.Name) | $($b.Blockers) |")
    }
}
$null = $sb.AppendLine("")

# --- Proxima acao ---
$null = $sb.AppendLine("## Proxima Acao Recomendada")
$null = $sb.AppendLine("")
$null = $sb.AppendLine($nextAction)
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("_Dashboard gerado por STATUS_ENGINE_V1 em ${now}_")

# ---------------------------------------------------------------------------
# Gravar
# ---------------------------------------------------------------------------
$outputDir = Split-Path $OutputPath -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
Set-Content -Path $OutputPath -Value $sb.ToString() -Encoding UTF8
Write-Output "DASHBOARD_GENERATED: $OutputPath"
