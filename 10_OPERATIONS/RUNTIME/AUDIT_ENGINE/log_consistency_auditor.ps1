# =============================================================================
# LOG_CONSISTENCY_AUDITOR.PS1
# Fabrica de Sistemas - Audit Engine Component
# Valida consistencia entre STATUS_LOG, FACTORY_STATUS_DASHBOARD e o projeto.
# Saida: JSON com lista de issues.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [Parameter(Mandatory = $true)]
    [string]$ProjectName,

    [string]$StatusLogPath     = "",
    [string]$DashboardPath     = "",
    [string]$DispatchLogDir    = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$result = [PSCustomObject]@{
    Component        = "LOG_CONSISTENCY"
    Issues           = @()
    StatusLogFound   = $false
    DashboardFound   = $false
    DispatchLogsFound = 0
    StatusLogEntries = 0
}

function Add-Issue {
    param([string]$Severity, [string]$Code, [string]$Message)
    $result.Issues += [PSCustomObject]@{ Severity = $Severity; Code = $Code; Message = $Message }
}

# ---------------------------------------------------------------------------
# Verificacao 1: STATUS_LOG do MISSION_EXECUTOR
# ---------------------------------------------------------------------------
if (-not $StatusLogPath) {
    $StatusLogPath = Join-Path (Split-Path $PSScriptRoot -Parent) "MISSION_EXECUTOR\STATUS_LOG.md"
}

if (Test-Path $StatusLogPath) {
    $result.StatusLogFound = $true
    $logLines = Get-Content -Path $StatusLogPath -Encoding UTF8
    $dataLines = @($logLines | Where-Object { $_ -match '^\|\s*\d{4}-\d{2}-\d{2}' })
    $result.StatusLogEntries = $dataLines.Count

    if ($dataLines.Count -eq 0) {
        Add-Issue "LOW" "LC001" "STATUS_LOG existe mas nao tem entradas de execucao registradas"
    }

    # Verificar se o projeto tem entradas no log
    # O log registra por agente/tarefa, nao por projeto — verificamos via _DISPATCH_LOG
} else {
    Add-Issue "LOW" "LC002" "STATUS_LOG do MISSION_EXECUTOR nao encontrado ($StatusLogPath)"
}

# ---------------------------------------------------------------------------
# Verificacao 2: _DISPATCH_LOG do projeto
# ---------------------------------------------------------------------------
if (-not $DispatchLogDir) {
    $DispatchLogDir = Join-Path $ProjectPath "_DISPATCH_LOG"
}

if (Test-Path $DispatchLogDir) {
    $dispatchFiles = @(Get-ChildItem -Path $DispatchLogDir -Filter "*.txt" -File)
    $result.DispatchLogsFound = $dispatchFiles.Count

    if ($dispatchFiles.Count -eq 0) {
        Add-Issue "LOW" "LC003" "_DISPATCH_LOG existe mas nao tem arquivos de despacho"
    } else {
        # Verificar arquivos vazios no dispatch log
        foreach ($df in $dispatchFiles) {
            if ($df.Length -eq 0) {
                Add-Issue "LOW" "LC004" "Arquivo de dispatch vazio: $($df.Name)"
            }
        }
    }
} else {
    Add-Issue "LOW" "LC005" "_DISPATCH_LOG nao encontrado — MISSION_EXECUTOR pode nao ter sido executado"
}

# ---------------------------------------------------------------------------
# Verificacao 3: FACTORY_STATUS_DASHBOARD
# ---------------------------------------------------------------------------
if (-not $DashboardPath) {
    $FabricaRoot   = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
    $DashboardPath = Join-Path $FabricaRoot "19_RELATORIOS\FACTORY_STATUS_DASHBOARD.md"
}

if (Test-Path $DashboardPath) {
    $result.DashboardFound = $true
    $dashContent = Get-Content -Path $DashboardPath -Encoding UTF8 -Raw

    # Verificar se o projeto aparece no dashboard
    if ($dashContent -notmatch [Regex]::Escape($ProjectName)) {
        Add-Issue "MEDIUM" "LC006" "Projeto '$ProjectName' nao encontrado no FACTORY_STATUS_DASHBOARD"
    }

    # Verificar se o dashboard tem data de geracao
    if ($dashContent -notmatch 'Gerado em') {
        Add-Issue "LOW" "LC007" "FACTORY_STATUS_DASHBOARD nao tem campo 'Gerado em' — pode estar desatualizado"
    }
} else {
    Add-Issue "MEDIUM" "LC008" "FACTORY_STATUS_DASHBOARD nao encontrado — STATUS_ENGINE pode nao ter sido executado"
}

# ---------------------------------------------------------------------------
# Saida
# ---------------------------------------------------------------------------
Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
