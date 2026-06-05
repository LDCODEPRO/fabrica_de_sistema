# =============================================================================
# PROJECT_STATUS_READER.PS1
# Fabrica de Sistemas - Runtime Component
# Le um diretorio de projeto e retorna um objeto com todos os dados de status.
# Saida: objeto PSCustomObject serializado como JSON via Write-Output.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Get-MdFieldValue {
    param([string[]]$Lines, [string]$FieldPattern)
    foreach ($line in $Lines) {
        if ($line -match "\|\s*\*\*$FieldPattern\*\*\s*\|\s*(.+?)\s*\|") {
            return $Matches[1].Trim()
        }
    }
    return ""
}

function Get-TaskFileStatus {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return "NAO_ENCONTRADO" }
    $content = Get-Content -Path $FilePath -Encoding UTF8 -Raw
    if ($content -match '(?m)^## Status\s*\r?\n\s*\r?\n(.+)') {
        return $Matches[1].Trim()
    }
    return "INDEFINIDO"
}

function Count-PendingTasks {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return 0 }
    $lines = Get-Content -Path $FilePath -Encoding UTF8
    return @($lines | Where-Object { $_ -match '^\s*-\s*\[\s*\]' }).Count
}

function Count-DoneTasks {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return 0 }
    $lines = Get-Content -Path $FilePath -Encoding UTF8
    return @($lines | Where-Object { $_ -match '^\s*-\s*\[x\]' -or $_ -match '^\s*-\s*\[X\]' }).Count
}

# ---------------------------------------------------------------------------
# Leitura do projeto
# ---------------------------------------------------------------------------
$projectName = Split-Path $ProjectPath -Leaf
$hasMissionBoard = Test-Path (Join-Path $ProjectPath "MISSION_BOARD.md")

$result = [PSCustomObject]@{
    Name            = $projectName
    Path            = $ProjectPath
    HasMissionBoard = $hasMissionBoard
    Status          = "SEM_MISSION_BOARD"
    Type            = ""
    Client          = ""
    Priority        = ""
    CurrentStage    = ""
    NextStage       = ""
    Blockers        = ""
    CreatedAt       = ""
    Agents          = @()
    Tasks           = @()
    LastLogEntry    = ""
    DispatchLogs    = @()
}

if (-not $hasMissionBoard) {
    Write-Output ($result | ConvertTo-Json -Depth 5 -Compress)
    exit 0
}

# ---------------------------------------------------------------------------
# MISSION_BOARD
# ---------------------------------------------------------------------------
$boardPath  = Join-Path $ProjectPath "MISSION_BOARD.md"
$boardLines = Get-Content -Path $boardPath -Encoding UTF8

$result.Status       = Get-MdFieldValue -Lines $boardLines -FieldPattern "Status"
$result.Type         = Get-MdFieldValue -Lines $boardLines -FieldPattern "Tipo"
$result.Client       = Get-MdFieldValue -Lines $boardLines -FieldPattern "Cliente"
$result.Priority     = Get-MdFieldValue -Lines $boardLines -FieldPattern "Prioridade"
$result.CurrentStage = Get-MdFieldValue -Lines $boardLines -FieldPattern "Etapa Atual"
$result.NextStage    = Get-MdFieldValue -Lines $boardLines -FieldPattern "Proxima Etapa"
$result.Blockers     = Get-MdFieldValue -Lines $boardLines -FieldPattern "Bloqueios"
$result.CreatedAt    = Get-MdFieldValue -Lines $boardLines -FieldPattern "Data Criacao"

# Agentes na tabela do MISSION_BOARD
$agentList = @()
foreach ($line in $boardLines) {
    if ($line -match '_AGENT' -and $line -match '\|') {
        $parts = ($line -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
        if ($parts.Count -ge 3) {
            $agentList += [PSCustomObject]@{
                Agent    = $parts[0]
                TaskFile = $parts[1]
                Status   = $parts[2]
            }
        }
    }
}
$result.Agents = $agentList

# Ultimo log do MISSION_BOARD
$logLines = @($boardLines | Where-Object { $_ -match '^\s*-\s*\[' })
if ($logLines.Count -gt 0) {
    $result.LastLogEntry = $logLines[-1].Trim()
}

# ---------------------------------------------------------------------------
# Task files individuais
# ---------------------------------------------------------------------------
$taskFileNames = @("ANALYST_TASK.md","ARCHITECT_TASK.md","DEVELOPER_TASK.md","QA_TASK.md","DOCS_TASK.md")
$taskList = @()
foreach ($tf in $taskFileNames) {
    $tfPath = Join-Path $ProjectPath $tf
    $taskList += [PSCustomObject]@{
        File     = $tf
        Exists   = (Test-Path $tfPath)
        Status   = (Get-TaskFileStatus -FilePath $tfPath)
        Pending  = (Count-PendingTasks -FilePath $tfPath)
        Done     = (Count-DoneTasks    -FilePath $tfPath)
    }
}
$result.Tasks = $taskList

# ---------------------------------------------------------------------------
# _DISPATCH_LOG
# ---------------------------------------------------------------------------
$dispatchDir = Join-Path $ProjectPath "_DISPATCH_LOG"
$dispatchEntries = @()
if (Test-Path $dispatchDir) {
    $logFiles = Get-ChildItem -Path $dispatchDir -Filter "*.txt" -File
    foreach ($lf in $logFiles) {
        $lines = Get-Content -Path $lf.FullName -Encoding UTF8
        $firstLine = ($lines | Where-Object { $_ -match '^\[' } | Select-Object -First 1)
        $dispatchEntries += [PSCustomObject]@{
            File      = $lf.Name
            FirstLine = $firstLine
        }
    }
}
$result.DispatchLogs = $dispatchEntries

# ---------------------------------------------------------------------------
# Saida
# ---------------------------------------------------------------------------
Write-Output ($result | ConvertTo-Json -Depth 5 -Compress)
