# =============================================================================
# MISSION_EXECUTOR.PS1
# Fabrica de Sistemas - Runtime Component
# Le o MISSION_BOARD de um projeto e despacha tarefas para os agentes.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
$ScriptDir  = $PSScriptRoot
$Dispatcher = Join-Path $ScriptDir "agent_dispatcher.ps1"
$Updater    = Join-Path $ScriptDir "status_updater.ps1"
$StatusLog  = Join-Path $ScriptDir "STATUS_LOG.md"

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
if (-not (Test-Path $ProjectPath)) {
    Write-Error "ERRO: Projeto nao encontrado: $ProjectPath"
    exit 1
}

$MissionBoard = Join-Path $ProjectPath "MISSION_BOARD.md"
if (-not (Test-Path $MissionBoard)) {
    Write-Error "ERRO: MISSION_BOARD.md nao encontrado em $ProjectPath"
    exit 1
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Write-Log {
    param([string]$Msg)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] $Msg"
}

function Append-StatusLog {
    param([string]$Date, [string]$Agent, [string]$Task, [string]$Old, [string]$New)
    $line = "| $Date | $Agent | $Task | $Old | $New |"
    Add-Content -Path $StatusLog -Value $line -Encoding UTF8
}

# ---------------------------------------------------------------------------
# Garantir cabecalho do STATUS_LOG
# ---------------------------------------------------------------------------
if (-not (Test-Path $StatusLog)) {
    $lines = @(
        "# STATUS_LOG - MISSION_EXECUTOR",
        "",
        "| Data/Hora           | Agente             | Tarefa              | Status Anterior | Status Novo  |",
        "|---------------------|--------------------|---------------------|-----------------|--------------|"
    )
    Set-Content -Path $StatusLog -Value ($lines -join "`r`n") -Encoding UTF8
    Write-Log "STATUS_LOG.md criado."
}

# ---------------------------------------------------------------------------
# Ler MISSION_BOARD
# ---------------------------------------------------------------------------
Write-Log "Lendo MISSION_BOARD: $MissionBoard"
$boardLines = Get-Content -Path $MissionBoard -Encoding UTF8

# Extrair nome do projeto
$projectName = Split-Path $ProjectPath -Leaf
foreach ($line in $boardLines) {
    if ($line -match '\|\s*\*\*Projeto\*\*\s*\|\s*(.+?)\s*\|') {
        $projectName = $Matches[1].Trim()
        break
    }
}
Write-Log "Projeto: $projectName"

# Linhas de agentes: contem _AGENT e pipe
$agentRows = $boardLines | Where-Object { ($_ -match '_AGENT') -and ($_ -match '\|') }

if ($agentRows.Count -eq 0) {
    Write-Log "AVISO: Nenhuma linha de agente encontrada no MISSION_BOARD."
    exit 0
}

# ---------------------------------------------------------------------------
# Processar cada agente
# ---------------------------------------------------------------------------
$executed = 0
$skipped  = 0

foreach ($row in $agentRows) {
    $parts = ($row -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    if ($parts.Count -lt 3) { continue }

    $agentName  = $parts[0]
    $taskFile   = $parts[1]
    $taskStatus = $parts[2]

    # Pular agentes sem arquivo de tarefa (coordenacao, tracos, vazio)
    if (($taskFile -eq "-") -or ($taskFile -eq "") -or ($taskFile -match '^\(') -or ($taskFile -match '^[-\x{2014}\x{2013}]')) {
        Write-Log "SKIP $agentName - sem arquivo de tarefa"
        $skipped++
        continue
    }

    # Pular agentes ja processados
    if (($taskStatus -eq "CONCLUIDO") -or ($taskStatus -eq "EM EXECUCAO")) {
        Write-Log "SKIP $agentName - status atual: $taskStatus"
        $skipped++
        continue
    }

    $taskPath = Join-Path $ProjectPath $taskFile
    if (-not (Test-Path $taskPath)) {
        Write-Log "AVISO $agentName - arquivo $taskFile nao encontrado. Pulando."
        $skipped++
        continue
    }

    Write-Log "Despachando: $agentName -> $taskFile (era: $taskStatus)"

    # Chamar dispatcher
    $dispatchOut = & $Dispatcher -AgentName $agentName -TaskFile $taskPath -ProjectPath $ProjectPath 2>&1
    Write-Log "Dispatcher: $dispatchOut"

    # Atualizar status
    $newStatus = "EM EXECUCAO"

    $r1 = & $Updater -FilePath $taskPath     -OldStatus $taskStatus -NewStatus $newStatus 2>&1
    $r2 = & $Updater -FilePath $MissionBoard -OldStatus $taskStatus -NewStatus $newStatus -AgentName $agentName 2>&1
    Write-Log "Updater tarefa: $r1"
    Write-Log "Updater board:  $r2"

    # Log
    $now = Get-Date -Format "yyyy-MM-dd HH:mm"
    Append-StatusLog -Date $now -Agent $agentName -Task $taskFile -Old $taskStatus -New $newStatus

    Write-Log "OK $agentName : $taskStatus -> $newStatus"
    $executed++
}

# ---------------------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------------------
Write-Log "---"
Write-Log "Execucao concluida. Despachadas: $executed | Ignoradas: $skipped"
Write-Log "Log: $StatusLog"
