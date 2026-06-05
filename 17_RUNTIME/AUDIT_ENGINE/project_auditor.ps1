# =============================================================================
# PROJECT_AUDITOR.PS1
# Fabrica de Sistemas - Audit Engine Component
# Orquestra a auditoria completa de um projeto, chamando os sub-auditores.
# Saida: JSON com resultado consolidado do projeto.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [string]$StatusLogPath  = "",
    [string]$DashboardPath  = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir   = $PSScriptRoot
$MBAuditor   = Join-Path $ScriptDir "mission_board_auditor.ps1"
$TFAuditor   = Join-Path $ScriptDir "task_file_auditor.ps1"
$LogAuditor  = Join-Path $ScriptDir "log_consistency_auditor.ps1"

$projectName = Split-Path $ProjectPath -Leaf

# ---------------------------------------------------------------------------
# Resultado base
# ---------------------------------------------------------------------------
$result = [PSCustomObject]@{
    Project      = $projectName
    Path         = $ProjectPath
    Verdict      = "APROVADO"   # APROVADO | ALERTA | REPROVADO
    Score        = 100
    Issues       = @()
    MBResult     = $null
    TFResult     = $null
    LogResult    = $null
}

function Merge-Issues {
    param($SourceResult)
    if ($SourceResult -and $SourceResult.Issues) {
        foreach ($issue in $SourceResult.Issues) {
            $result.Issues += $issue
        }
    }
}

function Run-Auditor {
    param([string]$Script, [hashtable]$SplatArgs)
    try {
        $raw = & $Script @SplatArgs 2>&1
        $jsonLine = ($raw | Where-Object { $_ -match '^\{' } | Select-Object -Last 1)
        if ($jsonLine) { return ($jsonLine | ConvertFrom-Json) }
        return $null
    } catch {
        return $null
    }
}

# ---------------------------------------------------------------------------
# 1. MISSION_BOARD audit
# ---------------------------------------------------------------------------
$mbResult = Run-Auditor -Script $MBAuditor -SplatArgs @{ ProjectPath = $ProjectPath }
$result.MBResult = $mbResult
Merge-Issues -SourceResult $mbResult

# Se nao tem MISSION_BOARD, nao tem como auditar o resto
$hasMissionBoard = ($mbResult -and (@($mbResult.Issues | Where-Object { $_.Code -eq "MB001" }).Count -eq 0))

# ---------------------------------------------------------------------------
# 2. TASK FILES audit (somente se board encontrado)
# ---------------------------------------------------------------------------
if ($hasMissionBoard -and $mbResult.Agents -and $mbResult.Agents.Count -gt 0) {
    $agentsJson = ($mbResult.Agents | ConvertTo-Json -Compress)
    $tfResult = Run-Auditor -Script $TFAuditor -SplatArgs @{
        ProjectPath = $ProjectPath
        AgentsJson  = $agentsJson
        BoardStatus = $mbResult.BoardStatus
    }
    $result.TFResult = $tfResult
    Merge-Issues -SourceResult $tfResult
}

# ---------------------------------------------------------------------------
# 3. LOG CONSISTENCY audit
# ---------------------------------------------------------------------------
$logArgs = @{ ProjectPath = $ProjectPath; ProjectName = $projectName }
if ($StatusLogPath) { $logArgs.StatusLogPath = $StatusLogPath }
if ($DashboardPath) { $logArgs.DashboardPath = $DashboardPath }

$logResult = Run-Auditor -Script $LogAuditor -SplatArgs $logArgs
$result.LogResult = $logResult
Merge-Issues -SourceResult $logResult

# ---------------------------------------------------------------------------
# Calcular score e veredicto
# ---------------------------------------------------------------------------
$criticals = @($result.Issues | Where-Object { $_.Severity -eq "CRITICAL" }).Count
$highs     = @($result.Issues | Where-Object { $_.Severity -eq "HIGH" }).Count
$mediums   = @($result.Issues | Where-Object { $_.Severity -eq "MEDIUM" }).Count
$lows      = @($result.Issues | Where-Object { $_.Severity -eq "LOW" }).Count

$score = 100 - ($criticals * 25) - ($highs * 15) - ($mediums * 8) - ($lows * 3)
if ($score -lt 0) { $score = 0 }
$result.Score = $score

if ($criticals -gt 0 -or $score -lt 40) {
    $result.Verdict = "REPROVADO"
} elseif ($highs -gt 0 -or $mediums -gt 0 -or $score -lt 80) {
    $result.Verdict = "ALERTA"
} else {
    $result.Verdict = "APROVADO"
}

# ---------------------------------------------------------------------------
# Saida
# ---------------------------------------------------------------------------
Write-Output ($result | ConvertTo-Json -Depth 8 -Compress)
