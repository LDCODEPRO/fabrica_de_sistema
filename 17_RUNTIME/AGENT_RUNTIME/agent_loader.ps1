# =============================================================================
# AGENT_LOADER.PS1
# Fabrica de Sistemas - Agent Runtime Component
# Carrega a identidade de um agente a partir de 05_AGENTS.
# Saida: JSON com identidade do agente.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$AgentName,

    [string]$AgentsRoot = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Resolver raiz de agentes
if (-not $AgentsRoot) {
    $FabricaRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
    $AgentsRoot  = Join-Path $FabricaRoot "05_AGENTS"
}

$result = [PSCustomObject]@{
    AgentName        = $AgentName
    Found            = $false
    AgentDir         = ""
    Identity         = ""
    Mission          = ""
    Limits           = ""
    Responsibilities = ""
    Workflow         = ""
    MissingFiles     = @()
}

$agentDir = Join-Path $AgentsRoot $AgentName

if (-not (Test-Path $agentDir)) {
    $result.Found = $false
    Write-Output ($result | ConvertTo-Json -Depth 3 -Compress)
    exit 0
}

$result.Found    = $true
$result.AgentDir = $agentDir

function Read-AgentFile {
    param([string]$FileName)
    $path = Join-Path $agentDir $FileName
    if (Test-Path $path) {
        return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8).Trim()
    }
    $result.MissingFiles += $FileName
    return ""
}

$result.Identity         = Read-AgentFile "IDENTITY.md"
$result.Mission          = Read-AgentFile "MISSION.md"
$result.Limits           = Read-AgentFile "LIMITS.md"
$result.Responsibilities = Read-AgentFile "RESPONSIBILITIES.md"
$result.Workflow         = Read-AgentFile "WORKFLOW.md"

Write-Output ($result | ConvertTo-Json -Depth 3 -Compress)
