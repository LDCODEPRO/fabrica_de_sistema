# =============================================================================
# AGENT_RESPONSE_INGESTOR.PS1
# Fabrica de Sistemas - Agent Runtime Component
# Le arquivo de resposta preenchido pelo operador, valida e registra evidencia.
# NAO declara tarefa concluida automaticamente.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [Parameter(Mandatory = $true)]
    [string]$AgentName,

    # Caminho customizado do arquivo de resposta (opcional)
    [string]$ResponseFile = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir  = $PSScriptRoot
$EvidenceWriter = Join-Path $ScriptDir "agent_evidence_writer.ps1"
$StatusUpdater  = Join-Path (Split-Path $ScriptDir -Parent) "MISSION_EXECUTOR\status_updater.ps1"

$projectName = Split-Path $ProjectPath -Leaf

# ---------------------------------------------------------------------------
# Localizar arquivo de resposta
# ---------------------------------------------------------------------------
if (-not $ResponseFile) {
    $ResponseFile = Join-Path $ProjectPath "_AGENT_RUNTIME\RESPONSES\${AgentName}_RESPONSE.md"
}

if (-not (Test-Path $ResponseFile)) {
    Write-Error "INGESTOR ERRO: Arquivo de resposta nao encontrado: $ResponseFile"
    exit 1
}

# ---------------------------------------------------------------------------
# Ler e validar conteudo
# ---------------------------------------------------------------------------
$content = [System.IO.File]::ReadAllText($ResponseFile, [System.Text.Encoding]::UTF8).Trim()

# Verificar se vazio ou placeholder
$isEmpty = [string]::IsNullOrWhiteSpace($content)
$isPlaceholder = ($content -match '^\[COLE A RESPOSTA') -or ($content -match '^# AGUARDANDO') -or ($content.Length -lt 50)

if ($isEmpty) {
    Write-Host "INGESTOR: Resposta vazia. Nenhuma evidencia gerada."
    Write-Output "INGEST_SKIPPED: resposta_vazia"
    exit 0
}

if ($isPlaceholder) {
    Write-Host "INGESTOR: Resposta contem apenas placeholder ($($content.Length) chars). Nenhuma evidencia gerada."
    Write-Output "INGEST_SKIPPED: apenas_placeholder"
    exit 0
}

Write-Host "INGESTOR: Resposta valida detectada ($($content.Length) chars). Processando..."

# ---------------------------------------------------------------------------
# Localizar task file correspondente ao agente
# ---------------------------------------------------------------------------
$taskFileMap = @{
    "ANALYST_AGENT"       = "ANALYST_TASK.md"
    "ARCHITECT_AGENT"     = "ARCHITECT_TASK.md"
    "DEVELOPER_AGENT"     = "DEVELOPER_TASK.md"
    "QA_AGENT"            = "QA_TASK.md"
    "DOCS_AGENT"          = "DOCS_TASK.md"
    "ORCHESTRATOR_AGENT"  = ""
}

$taskFileName = if ($taskFileMap.ContainsKey($AgentName)) { $taskFileMap[$AgentName] } else { "" }
$taskFilePath = if ($taskFileName) { Join-Path $ProjectPath $taskFileName } else { "" }

# ---------------------------------------------------------------------------
# Gravar evidencia
# ---------------------------------------------------------------------------
$evidenceArgs = @{
    ProjectPath     = $ProjectPath
    AgentName       = $AgentName
    ResponseContent = $content
    ProjectName     = $projectName
    TaskFile        = $taskFileName
}

$evidenceOut = & $EvidenceWriter @evidenceArgs 2>&1
Write-Host "INGESTOR: $evidenceOut"

# ---------------------------------------------------------------------------
# Atualizar status no task file e MISSION_BOARD
# ---------------------------------------------------------------------------
$newStatus = "AGENT_RESPONSE_RECEIVED"

if ($taskFilePath -and (Test-Path $taskFilePath) -and (Test-Path $StatusUpdater)) {
    $missionBoard = Join-Path $ProjectPath "MISSION_BOARD.md"

    # Ler status atual do task file
    $tfContent = [System.IO.File]::ReadAllText($taskFilePath, [System.Text.Encoding]::UTF8)
    $oldStatus = "EM EXECUCAO"
    if ($tfContent -match '(?m)^## Status\s*\r?\n\s*\r?\n(.+)') {
        $oldStatus = $Matches[1].Trim()
    }

    & $StatusUpdater -FilePath $taskFilePath -OldStatus $oldStatus -NewStatus $newStatus 2>&1 | Out-Null
    Write-Host "INGESTOR: Status atualizado em $taskFileName : $oldStatus -> $newStatus"

    if (Test-Path $missionBoard) {
        & $StatusUpdater -FilePath $missionBoard -OldStatus $oldStatus -NewStatus $newStatus -AgentName $AgentName 2>&1 | Out-Null
        Write-Host "INGESTOR: MISSION_BOARD atualizado para $AgentName"
    }
} else {
    Write-Host "INGESTOR: Task file ou status_updater nao encontrado. Status nao atualizado automaticamente."
}

# ---------------------------------------------------------------------------
# Registrar no AGENT_LOG
# ---------------------------------------------------------------------------
$agentLogDir = Join-Path $ProjectPath "_AGENT_RUNTIME"
if (-not (Test-Path $agentLogDir)) {
    New-Item -ItemType Directory -Path $agentLogDir -Force | Out-Null
}
$agentLog = Join-Path $agentLogDir "AGENT_LOG.md"
if (-not (Test-Path $agentLog)) {
    Set-Content -Path $agentLog -Value "# AGENT_LOG" -Encoding UTF8
}
$ts      = Get-Date -Format "yyyy-MM-dd HH:mm"
$logLine = "[$ts] $AgentName - RESPONSE_INGESTED - chars=$($content.Length) - status=$newStatus"
Add-Content -Path $agentLog -Value $logLine -Encoding UTF8

Write-Output "INGEST_OK: $AgentName status=$newStatus evidencia=gravada"
