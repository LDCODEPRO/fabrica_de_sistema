# =============================================================================
# AUDIT_ENGINE.PS1
# Fabrica de Sistemas - Runtime Component
# Escaneia 15_PROJETOS, audita cada projeto e gera FACTORY_AUDIT_REPORT.md.
# =============================================================================

param(
    [string]$FabricaRoot    = "",
    [string]$ProjectsRoot   = "",
    [string]$ReportPath     = "",
    [string]$ProjectName    = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Resolver caminhos
# ---------------------------------------------------------------------------
$ScriptDir = $PSScriptRoot

if (-not $FabricaRoot) {
    $FabricaRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent
}
if (-not $ProjectsRoot) {
    $ProjectsRoot = Join-Path $FabricaRoot "15_PROJETOS"
}
if (-not $ReportPath) {
    $ReportPath = Join-Path $FabricaRoot "19_RELATORIOS\FACTORY_AUDIT_REPORT.md"
}

$StatusLogPath  = Join-Path $FabricaRoot "17_RUNTIME\MISSION_EXECUTOR\STATUS_LOG.md"
$DashboardPath  = Join-Path $FabricaRoot "19_RELATORIOS\FACTORY_STATUS_DASHBOARD.md"
$Auditor        = Join-Path $ScriptDir "project_auditor.ps1"

# ---------------------------------------------------------------------------
# Validacoes
# ---------------------------------------------------------------------------
if (-not (Test-Path $ProjectsRoot)) {
    Write-Error "AUDIT_ENGINE: Pasta de projetos nao encontrada: $ProjectsRoot"
    exit 1
}
if (-not (Test-Path $Auditor)) {
    Write-Error "AUDIT_ENGINE: project_auditor.ps1 nao encontrado"
    exit 1
}

function Write-Log {
    param([string]$Msg)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] $Msg"
}

# ---------------------------------------------------------------------------
# Descobrir projetos
# ---------------------------------------------------------------------------
Write-Log "Escaneando projetos em: $ProjectsRoot"

if ($ProjectName) {
    $dirs = Get-ChildItem -Path $ProjectsRoot -Directory | Where-Object { $_.Name -eq $ProjectName }
} else {
    $dirs = Get-ChildItem -Path $ProjectsRoot -Directory
}

if ($dirs.Count -eq 0) {
    Write-Log "Nenhum projeto encontrado."
    exit 0
}

Write-Log "Projetos encontrados: $($dirs.Count)"

# ---------------------------------------------------------------------------
# Auditar cada projeto
# ---------------------------------------------------------------------------
$allResults = @()

foreach ($dir in $dirs) {
    Write-Log "Auditando: $($dir.Name)"

    try {
        $raw = & $Auditor `
            -ProjectPath $dir.FullName `
            -StatusLogPath $StatusLogPath `
            -DashboardPath $DashboardPath 2>&1

        $jsonLine = ($raw | Where-Object { $_ -match '^\{' } | Select-Object -Last 1)

        if ($jsonLine) {
            $obj = $jsonLine | ConvertFrom-Json
            $allResults += $obj
            $issueCount = if ($obj.Issues) { @($obj.Issues).Count } else { 0 }
            Write-Log "  Veredicto: $($obj.Verdict) | Score: $($obj.Score) | Issues: $issueCount"
        } else {
            Write-Log "  AVISO: nenhum resultado JSON para $($dir.Name)"
        }
    } catch {
        Write-Log "  ERRO ao auditar $($dir.Name): $_"
    }
}

Write-Log "Auditoria concluida. $($allResults.Count) projeto(s) processados."

# ---------------------------------------------------------------------------
# Calcular metricas globais
# ---------------------------------------------------------------------------
$total      = $allResults.Count
$approved   = @($allResults | Where-Object { $_.Verdict -eq "APROVADO" }).Count
$alert      = @($allResults | Where-Object { $_.Verdict -eq "ALERTA"   }).Count
$failed     = @($allResults | Where-Object { $_.Verdict -eq "REPROVADO"}).Count

$allIssues  = @($allResults | ForEach-Object { $_.Issues } | Where-Object { $_ -ne $null })
$criticals  = @($allIssues  | Where-Object { $_.Severity -eq "CRITICAL" }).Count
$highs      = @($allIssues  | Where-Object { $_.Severity -eq "HIGH"     }).Count
$mediums    = @($allIssues  | Where-Object { $_.Severity -eq "MEDIUM"   }).Count
$lows       = @($allIssues  | Where-Object { $_.Severity -eq "LOW"      }).Count

# Score operacional da Fabrica (media dos scores)
$factoryScore = 0
if ($total -gt 0) {
    $scoreSum = 0
    foreach ($r in $allResults) { $scoreSum += [int]$r.Score }
    $factoryScore = [math]::Round($scoreSum / $total, 0)
}

# Proximo passo
$nextAction = "Fabrica operacional. Nenhuma acao critica necessaria."
if ($criticals -gt 0) {
    $nextAction = "URGENTE: $criticals issue(s) critica(s). Revisar projetos REPROVADOS imediatamente."
} elseif ($highs -gt 0) {
    $nextAction = "ATENCAO: $highs issue(s) alta(s). Corrigir task files ausentes ou status inconsistentes."
} elseif ($mediums -gt 0) {
    $nextAction = "REVISAR: $mediums issue(s) media(s). Verificar status e campos obrigatorios."
} elseif ($lows -gt 0) {
    $nextAction = "MANUTENCAO: $lows issue(s) baixa(s). Melhorar documentacao e logs."
}

$now = Get-Date -Format "yyyy-MM-dd HH:mm"

# ---------------------------------------------------------------------------
# Gerar relatorio
# ---------------------------------------------------------------------------
$sb = [System.Text.StringBuilder]::new()

$null = $sb.AppendLine("# FACTORY AUDIT REPORT")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("**Gerado em:** $now")
$null = $sb.AppendLine("**Motor:** AUDIT_ENGINE_V1")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

# Resumo executivo
$null = $sb.AppendLine("## Resumo Executivo")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("| Metrica | Valor |")
$null = $sb.AppendLine("|---|---|")
$null = $sb.AppendLine("| Total de projetos auditados | $total |")
$null = $sb.AppendLine("| Projetos APROVADOS | $approved |")
$null = $sb.AppendLine("| Projetos com ALERTA | $alert |")
$null = $sb.AppendLine("| Projetos REPROVADOS | $failed |")
$null = $sb.AppendLine("| Issues criticas | $criticals |")
$null = $sb.AppendLine("| Issues altas | $highs |")
$null = $sb.AppendLine("| Issues medias | $mediums |")
$null = $sb.AppendLine("| Issues baixas | $lows |")
$null = $sb.AppendLine("| **Score operacional da Fabrica** | **$factoryScore / 100** |")
$null = $sb.AppendLine("")

# Nivel operacional
$level = if ($factoryScore -ge 90) { "EXCELENTE" } `
    elseif ($factoryScore -ge 75) { "BOM" } `
    elseif ($factoryScore -ge 50) { "REGULAR" } `
    else { "CRITICO" }
$null = $sb.AppendLine("**Nivel operacional:** $level")
$null = $sb.AppendLine("")

# Proxima acao
$null = $sb.AppendLine("## Proxima Acao Recomendada")
$null = $sb.AppendLine("")
$null = $sb.AppendLine($nextAction)
$null = $sb.AppendLine("")
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")

# Detalhe por projeto
$null = $sb.AppendLine("## Detalhe por Projeto")
$null = $sb.AppendLine("")

foreach ($r in $allResults) {
    $issueCount  = if ($r.Issues) { @($r.Issues).Count } else { 0 }
    $verdictIcon = switch ($r.Verdict) {
        "APROVADO"  { "OK" }
        "ALERTA"    { "ALERTA" }
        "REPROVADO" { "REPROVADO" }
        default     { "?" }
    }

    $null = $sb.AppendLine("### [$verdictIcon] $($r.Project) - Score: $($r.Score)/100")
    $null = $sb.AppendLine("")

    if ($issueCount -eq 0) {
        $null = $sb.AppendLine("_Nenhuma issue encontrada._")
    } else {
        $null = $sb.AppendLine("| Severidade | Codigo | Descricao |")
        $null = $sb.AppendLine("|---|---|---|")
        foreach ($issue in $r.Issues) {
            $null = $sb.AppendLine("| $($issue.Severity) | $($issue.Code) | $($issue.Message) |")
        }
    }
    $null = $sb.AppendLine("")

    # Task files se disponivel
    if ($r.TFResult -and $r.TFResult.TaskFiles -and $r.TFResult.TaskFiles.Count -gt 0) {
        $null = $sb.AppendLine("**Task Files:**")
        $null = $sb.AppendLine("")
        $null = $sb.AppendLine("| Agente | Arquivo | Status | Pendentes | Concluidas |")
        $null = $sb.AppendLine("|---|---|---|---|---|")
        foreach ($tf in $r.TFResult.TaskFiles) {
            $null = $sb.AppendLine("| $($tf.Agent) | $($tf.File) | $($tf.Status) | $($tf.Pending) | $($tf.Done) |")
        }
        $null = $sb.AppendLine("")
    }

    # Info de log
    if ($r.LogResult) {
        $dispCount  = if ($r.LogResult.DispatchLogsFound) { $r.LogResult.DispatchLogsFound } else { 0 }
        $logEntries = if ($r.LogResult.StatusLogEntries)  { $r.LogResult.StatusLogEntries  } else { 0 }
        $null = $sb.AppendLine("**Log:** STATUS_LOG=$($r.LogResult.StatusLogFound) ($logEntries entradas) | Dispatch logs=$dispCount | Dashboard=$($r.LogResult.DashboardFound)")
        $null = $sb.AppendLine("")
    }
}

# Issues consolidadas por severidade
$null = $sb.AppendLine("---")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("## Issues Criticas")
$null = $sb.AppendLine("")
$critList = @($allIssues | Where-Object { $_.Severity -eq "CRITICAL" })
if ($critList.Count -eq 0) {
    $null = $sb.AppendLine("_Nenhuma issue critica._")
} else {
    $null = $sb.AppendLine("| Codigo | Descricao |")
    $null = $sb.AppendLine("|---|---|")
    foreach ($i in $critList) { $null = $sb.AppendLine("| $($i.Code) | $($i.Message) |") }
}
$null = $sb.AppendLine("")

$null = $sb.AppendLine("## Issues Altas")
$null = $sb.AppendLine("")
$highList = @($allIssues | Where-Object { $_.Severity -eq "HIGH" })
if ($highList.Count -eq 0) {
    $null = $sb.AppendLine("_Nenhuma issue alta._")
} else {
    $null = $sb.AppendLine("| Codigo | Descricao |")
    $null = $sb.AppendLine("|---|---|")
    foreach ($i in $highList) { $null = $sb.AppendLine("| $($i.Code) | $($i.Message) |") }
}
$null = $sb.AppendLine("")

$null = $sb.AppendLine("---")
$null = $sb.AppendLine("_Auditoria gerada por AUDIT_ENGINE_V1 em ${now}_")

# ---------------------------------------------------------------------------
# Gravar
# ---------------------------------------------------------------------------
$reportDir = Split-Path $ReportPath -Parent
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}
Set-Content -Path $ReportPath -Value $sb.ToString() -Encoding UTF8
Write-Log "Relatorio gerado: $ReportPath"
