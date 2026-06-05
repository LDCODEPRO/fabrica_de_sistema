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
# Classificacao do projeto
# ---------------------------------------------------------------------------
# Retorna: OPERATIONAL_PROJECT | LEGACY_PROJECT | INTERNAL_FACTORY_SYSTEM | TEMPLATE_OR_REFERENCE
function Get-ProjectClassification {
    param([string]$Name, [string]$Path)

    # Sistemas internos conhecidos da Fabrica
    $internalNames = @("PROJECT_FACTORY", "PROJECT_FACTORY_CLI", "PROJECT_INTAKE_SYSTEM", "PROJECT_ORCHESTRATOR")
    if ($internalNames -contains $Name) { return "INTERNAL_FACTORY_SYSTEM" }

    # Templates e referencias
    if ($Name -match '^TEMPLATE' -or $Name -match '_TEMPLATE$' -or $Name -match '^MODELO') {
        return "TEMPLATE_OR_REFERENCE"
    }

    # Projetos operacionais: nome comeca com PROJETO_ e tem MISSION_BOARD
    if ($Name -match '^PROJETO_') {
        $board = Join-Path $Path "MISSION_BOARD.md"
        if (Test-Path $board) { return "OPERATIONAL_PROJECT" }
        return "LEGACY_PROJECT"
    }

    # Qualquer outro nome sem MISSION_BOARD = referencia interna
    $board = Join-Path $Path "MISSION_BOARD.md"
    if (-not (Test-Path $board)) { return "INTERNAL_FACTORY_SYSTEM" }

    return "OPERATIONAL_PROJECT"
}

$classification = Get-ProjectClassification -Name $projectName -Path $ProjectPath

# ---------------------------------------------------------------------------
# Resultado base
# ---------------------------------------------------------------------------
$result = [PSCustomObject]@{
    Project        = $projectName
    Path           = $ProjectPath
    Classification = $classification
    Verdict        = "APROVADO"
    Score          = 100
    Issues         = @()
    MBResult       = $null
    TFResult       = $null
    LogResult      = $null
}

# ---------------------------------------------------------------------------
# Saida antecipada para classificacoes que nao exigem auditoria completa
# ---------------------------------------------------------------------------
if ($classification -eq "INTERNAL_FACTORY_SYSTEM") {
    $result.Verdict = "EXCLUDED_INTERNAL_SYSTEM"
    $result.Score   = -1
    Write-Output ($result | ConvertTo-Json -Depth 8 -Compress)
    exit 0
}

if ($classification -eq "TEMPLATE_OR_REFERENCE") {
    $result.Verdict = "EXCLUDED_TEMPLATE"
    $result.Score   = -1
    Write-Output ($result | ConvertTo-Json -Depth 8 -Compress)
    exit 0
}

if ($classification -eq "LEGACY_PROJECT") {
    $result.Verdict = "NEEDS_ORCHESTRATION"
    $result.Score   = -1
    $result.Issues += [PSCustomObject]@{
        Severity = "INFO"
        Code     = "CL001"
        Message  = "Projeto legado sem MISSION_BOARD. Recomendado: executar PROJECT_ORCHESTRATOR para criar estrutura."
    }
    Write-Output ($result | ConvertTo-Json -Depth 8 -Compress)
    exit 0
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
