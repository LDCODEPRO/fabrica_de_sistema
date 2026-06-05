# =============================================================================
# TASK_FILE_AUDITOR.PS1
# Fabrica de Sistemas - Audit Engine Component
# Valida task files dos agentes contra o MISSION_BOARD.
# Saida: JSON com lista de issues.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    # JSON serializado do array de agentes vindo do mission_board_auditor
    [Parameter(Mandatory = $true)]
    [string]$AgentsJson,

    # Status do board vindo do mission_board_auditor
    [string]$BoardStatus = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$VALID_STATUSES = @(
    "AGUARDANDO", "EM EXECUCAO", "CONCLUIDO",
    "REPROVADO", "BLOQUEADO", "PENDENTE",
    "PROMPT_GERADO", "AGENT_RESPONSE_RECEIVED", "EM_VALIDACAO"
)

# Agentes de coordenacao que nao precisam de task file
$COORDINATION_PATTERNS = @('^\(', '^[-]', '^$')

$result = [PSCustomObject]@{
    Component  = "TASK_FILES"
    Issues     = @()
    TaskFiles  = @()
}

function Add-Issue {
    param([string]$Severity, [string]$Code, [string]$Message)
    $result.Issues += [PSCustomObject]@{ Severity = $Severity; Code = $Code; Message = $Message }
}

function Is-CoordinationTask {
    param([string]$TaskFile)
    foreach ($p in $COORDINATION_PATTERNS) {
        if ($TaskFile -match $p) { return $true }
    }
    # Testa se contem unicode dash ou parens
    if ($TaskFile -match '[–—‒]') { return $true }
    if ($TaskFile.Length -le 2) { return $true }
    return $false
}

# ---------------------------------------------------------------------------
# Parse agentes
# ---------------------------------------------------------------------------
try {
    $agents = $AgentsJson | ConvertFrom-Json
} catch {
    Add-Issue "CRITICAL" "TF000" "Impossivel parsear AgentsJson: $_"
    Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
    exit 0
}

if (-not $agents -or $agents.Count -eq 0) {
    Add-Issue "HIGH" "TF001" "Nenhum agente para auditar (lista vazia)"
    Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
    exit 0
}

# ---------------------------------------------------------------------------
# Auditar cada agente
# ---------------------------------------------------------------------------
$taskFileList = @()

foreach ($agent in $agents) {
    $agentName  = $agent.Agent
    $taskFile   = $agent.TaskFile
    $agentStatus = $agent.Status

    # Agente de coordenacao sem task file — justificado
    if (Is-CoordinationTask -TaskFile $taskFile) {
        $taskFileList += [PSCustomObject]@{
            Agent    = $agentName
            File     = $taskFile
            Exists   = $false
            Status   = "NAO_APLICAVEL"
            Note     = "Agente de coordenacao — sem task file esperado"
            Pending  = 0
            Done     = 0
        }
        continue
    }

    $tfPath = Join-Path $ProjectPath $taskFile

    # Verificacao: task file existe?
    if (-not (Test-Path $tfPath)) {
        Add-Issue "HIGH" "TF002" "Task file ausente para agente $agentName : $taskFile"
        $taskFileList += [PSCustomObject]@{
            Agent   = $agentName; File = $taskFile; Exists = $false
            Status  = "AUSENTE"; Note = ""; Pending = 0; Done = 0
        }
        continue
    }

    $tfContent = Get-Content -Path $tfPath -Encoding UTF8 -Raw
    $tfLines   = Get-Content -Path $tfPath -Encoding UTF8

    # Verificacao: arquivo vazio?
    if ([string]::IsNullOrWhiteSpace($tfContent)) {
        Add-Issue "HIGH" "TF003" "Task file vazio para agente $agentName : $taskFile"
        $taskFileList += [PSCustomObject]@{
            Agent = $agentName; File = $taskFile; Exists = $true
            Status = "VAZIO"; Note = ""; Pending = 0; Done = 0
        }
        continue
    }

    # Extrair status do task file
    $fileStatus = "INDEFINIDO"
    if ($tfContent -match '(?m)^## Status\s*\r?\n\s*\r?\n(.+)') {
        $fileStatus = $Matches[1].Trim()
    }

    # Verificacao: status valido no task file?
    if ($VALID_STATUSES -notcontains $fileStatus) {
        Add-Issue "MEDIUM" "TF004" "Status invalido em $taskFile : '$fileStatus'"
    }

    # Verificacao: status task file bate com MISSION_BOARD?
    if ($agentStatus -and $fileStatus -ne "INDEFINIDO") {
        if ($agentStatus -ne $fileStatus) {
            Add-Issue "MEDIUM" "TF005" "Divergencia de status: BOARD='$agentStatus' vs FILE='$fileStatus' para $agentName"
        }
    }

    # Contar subtarefas
    $pending = @($tfLines | Where-Object { $_ -match '^\s*-\s*\[\s*\]' }).Count
    $done    = @($tfLines | Where-Object { $_ -match '^\s*-\s*\[[xX]\]' }).Count

    # Verificacao: agente marcado CONCLUIDO mas ainda tem tarefas pendentes?
    if ($agentStatus -eq "CONCLUIDO" -and $pending -gt 0) {
        Add-Issue "MEDIUM" "TF006" "Agente $agentName marcado CONCLUIDO mas tem $pending subtarefa(s) pendente(s)"
    }

    # Verificacao: nenhuma tarefa definida no arquivo?
    if ($pending -eq 0 -and $done -eq 0) {
        Add-Issue "LOW" "TF007" "Task file $taskFile nao tem nenhuma subtarefa definida"
    }

    $taskFileList += [PSCustomObject]@{
        Agent   = $agentName
        File    = $taskFile
        Exists  = $true
        Status  = $fileStatus
        Note    = ""
        Pending = $pending
        Done    = $done
    }
}

$result.TaskFiles = $taskFileList

# ---------------------------------------------------------------------------
# Saida
# ---------------------------------------------------------------------------
Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
