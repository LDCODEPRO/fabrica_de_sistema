# =============================================================================
# AGENT_RUNTIME.PS1
# Fabrica de Sistemas - Agent Runtime - Modo HUMAN_ASSISTED
# Gera prompts para agentes ou ingere respostas do operador.
# NAO usa APIs externas. NAO simula respostas.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectName,

    # Nome do agente (opcional - lista agentes disponiveis se omitido)
    [string]$AgentName = "",

    # Modo de operacao
    # Generate: cria prompt para o agente
    # Ingest:   ingere resposta colada pelo operador
    # Status:   exibe status atual de todos os agentes
    [ValidateSet("Generate","Ingest","Status")]
    [string]$Mode = "Generate",

    # Raiz da Fabrica (detectada automaticamente se omitida)
    [string]$RootPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
$ScriptDir = $PSScriptRoot

if (-not $RootPath) {
    $RootPath = Split-Path (Split-Path $ScriptDir -Parent) -Parent
}

$ProjectsRoot = Join-Path $RootPath "15_PROJETOS"
$AgentsRoot   = Join-Path $RootPath "05_AGENTS"
$ExecutorDir  = Join-Path $RootPath "17_RUNTIME\MISSION_EXECUTOR"

$Loader       = Join-Path $ScriptDir "agent_loader.ps1"
$Builder      = Join-Path $ScriptDir "agent_prompt_builder.ps1"
$Ingestor     = Join-Path $ScriptDir "agent_response_ingestor.ps1"

$ProjectPath  = Join-Path $ProjectsRoot $ProjectName

# ---------------------------------------------------------------------------
# Validacoes basicas
# ---------------------------------------------------------------------------
if (-not (Test-Path $ProjectPath)) {
    Write-Error "AGENT_RUNTIME: Projeto nao encontrado: $ProjectPath"
    exit 1
}

$MissionBoard = Join-Path $ProjectPath "MISSION_BOARD.md"
if (-not (Test-Path $MissionBoard)) {
    Write-Error "AGENT_RUNTIME: MISSION_BOARD.md nao encontrado em $ProjectPath"
    exit 1
}

function Write-Log {
    param([string]$Msg)
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[$ts] $Msg"
}

# ---------------------------------------------------------------------------
# Ler MISSION_BOARD
# ---------------------------------------------------------------------------
$boardLines = Get-Content -Path $MissionBoard -Encoding UTF8

$projectType = ""
foreach ($line in $boardLines) {
    if ($line -match '\|\s*\*\*Tipo\*\*\s*\|\s*(.+?)\s*\|') {
        $projectType = $Matches[1].Trim()
        break
    }
}

# Extrair tabela de agentes
$agentRows = @($boardLines | Where-Object { $_ -match '_AGENT' -and $_ -match '\|' })

if ($agentRows.Count -eq 0) {
    Write-Error "AGENT_RUNTIME: Nenhum agente encontrado no MISSION_BOARD."
    exit 1
}

# Parse agentes
$agentTable = @()
foreach ($row in $agentRows) {
    $parts = ($row -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    if ($parts.Count -ge 3) {
        $agentTable += [PSCustomObject]@{
            Agent    = $parts[0]
            TaskFile = $parts[1]
            Status   = $parts[2]
        }
    }
}

# ---------------------------------------------------------------------------
# Modo STATUS: listar agentes
# ---------------------------------------------------------------------------
if ($Mode -eq "Status") {
    Write-Host ""
    Write-Host "=== AGENT_RUNTIME - STATUS ($ProjectName) ==="
    Write-Host ""
    Write-Host ("| {0,-30} | {1,-20} | {2,-25} |" -f "Agente", "Arquivo", "Status")
    Write-Host ("| {0,-30} | {1,-20} | {2,-25} |" -f ("-"*30), ("-"*20), ("-"*25))
    foreach ($a in $agentTable) {
        Write-Host ("| {0,-30} | {1,-20} | {2,-25} |" -f $a.Agent, $a.TaskFile, $a.Status)
    }
    Write-Host ""
    exit 0
}

# ---------------------------------------------------------------------------
# Selecionar agente
# ---------------------------------------------------------------------------
if (-not $AgentName) {
    # Auto-selecionar: primeiro agente com task file pendente ou em execucao
    $candidate = $agentTable | Where-Object {
        ($_.Status -eq "AGUARDANDO" -or $_.Status -eq "EM EXECUCAO" -or $_.Status -eq "PROMPT_GERADO") `
        -and $_.TaskFile -notmatch '^-' -and $_.TaskFile -notmatch '^\(' -and $_.TaskFile.Length -gt 3
    } | Select-Object -First 1

    if (-not $candidate) {
        Write-Log "Nenhum agente pendente encontrado. Todos os agentes estao concluidos ou bloqueados."
        exit 0
    }
    $AgentName = $candidate.Agent
    Write-Log "Agente selecionado automaticamente: $AgentName"
}

# Localizar agente na tabela
$agentRow = $agentTable | Where-Object { $_.Agent -eq $AgentName } | Select-Object -First 1
if (-not $agentRow) {
    Write-Error "AGENT_RUNTIME: Agente '$AgentName' nao encontrado no MISSION_BOARD."
    exit 1
}

Write-Log "Agente: $AgentName | Tarefa: $($agentRow.TaskFile) | Status: $($agentRow.Status)"

# ---------------------------------------------------------------------------
# Modo INGEST
# ---------------------------------------------------------------------------
if ($Mode -eq "Ingest") {
    Write-Log "Modo: INGEST - processando resposta para $AgentName"
    $out = & $Ingestor -ProjectPath $ProjectPath -AgentName $AgentName 2>&1
    Write-Log $out
    exit 0
}

# ---------------------------------------------------------------------------
# Modo GENERATE: criar prompt
# ---------------------------------------------------------------------------
Write-Log "Modo: GENERATE - gerando prompt para $AgentName"

# Verificar se agente existe em 05_AGENTS
$loaderOut = & $Loader -AgentName $AgentName -AgentsRoot $AgentsRoot 2>&1
$jsonLine  = ($loaderOut | Where-Object { $_ -match '^\{' } | Select-Object -Last 1)

if (-not $jsonLine) {
    Write-Error "AGENT_RUNTIME: Falha ao carregar agente $AgentName"
    exit 1
}

$agentData = $jsonLine | ConvertFrom-Json

if (-not $agentData.Found) {
    Write-Log "AVISO: Agente $AgentName nao encontrado em 05_AGENTS. Usando dados minimos."
}

# Ler task file
$taskFilePath = ""
$taskContent  = ""
if ($agentRow.TaskFile -and $agentRow.TaskFile.Length -gt 3 -and $agentRow.TaskFile -notmatch '^[-–(]') {
    $taskFilePath = Join-Path $ProjectPath $agentRow.TaskFile
    if (Test-Path $taskFilePath) {
        $taskContent = [System.IO.File]::ReadAllText($taskFilePath, [System.Text.Encoding]::UTF8)
    } else {
        $taskContent = "Task file nao encontrado: $($agentRow.TaskFile)"
    }
} else {
    $taskContent = "Agente de coordenacao - sem task file dedicado."
}

# Construir prompt
$promptArgs = @{
    AgentJson    = $agentData | ConvertTo-Json -Compress
    TaskContent  = $taskContent
    ProjectName  = $ProjectName
    ProjectType  = $projectType
    TaskFile     = $agentRow.TaskFile
    TaskStatus   = $agentRow.Status
}

$promptContent = & $Builder @promptArgs 2>&1
$promptText    = ($promptContent | Where-Object { $_ -notmatch '^\[' }) -join "`n"

# Garantir estrutura _AGENT_RUNTIME
$agentRuntimeDir = Join-Path $ProjectPath "_AGENT_RUNTIME"
$promptsDir      = Join-Path $agentRuntimeDir "PROMPTS"
$responsesDir    = Join-Path $agentRuntimeDir "RESPONSES"
$evidenceDir     = Join-Path $agentRuntimeDir "EVIDENCE"

foreach ($dir in @($promptsDir, $responsesDir, $evidenceDir)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Gravar prompt
$promptFile = Join-Path $promptsDir "${AgentName}_PROMPT.md"
Set-Content -Path $promptFile -Value $promptText -Encoding UTF8
Write-Log "Prompt gravado: $promptFile"

# Criar arquivo de resposta vazio (template para o operador)
$responseFile = Join-Path $responsesDir "${AgentName}_RESPONSE.md"
if (-not (Test-Path $responseFile)) {
    $responseTemplate = @"
# RESPOSTA - $AgentName
# Projeto: $ProjectName
#
# INSTRUCOES PARA O OPERADOR:
# 1. Abra o arquivo de prompt em: PROMPTS/${AgentName}_PROMPT.md
# 2. Copie o conteudo para ChatGPT, Claude ou outro LLM.
# 3. APAGUE este bloco de instrucoes e cole a resposta aqui.
# 4. Salve o arquivo.
# 5. Execute: agent_runtime.ps1 -ProjectName "$ProjectName" -AgentName "$AgentName" -Mode Ingest

[COLE A RESPOSTA DO AGENTE AQUI]
"@
    Set-Content -Path $responseFile -Value $responseTemplate -Encoding UTF8
    Write-Log "Template de resposta criado: $responseFile"
}

# Atualizar AGENT_LOG
$agentLog = Join-Path $agentRuntimeDir "AGENT_LOG.md"
if (-not (Test-Path $agentLog)) {
    Set-Content -Path $agentLog -Value "# AGENT_LOG - $ProjectName" -Encoding UTF8
}
$ts      = Get-Date -Format "yyyy-MM-dd HH:mm"
$logLine = "[$ts] $AgentName - PROMPT_GENERATED - task=$($agentRow.TaskFile) - status=$($agentRow.Status)"
Add-Content -Path $agentLog -Value $logLine -Encoding UTF8

# Atualizar status para PROMPT_GERADO
$StatusUpdater = Join-Path $ExecutorDir "status_updater.ps1"
if ($taskFilePath -and (Test-Path $taskFilePath) -and (Test-Path $StatusUpdater)) {
    $oldStatus = $agentRow.Status
    & $StatusUpdater -FilePath $taskFilePath -OldStatus $oldStatus -NewStatus "PROMPT_GERADO" 2>&1 | Out-Null
    & $StatusUpdater -FilePath $MissionBoard -OldStatus $oldStatus -NewStatus "PROMPT_GERADO" -AgentName $AgentName 2>&1 | Out-Null
    Write-Log "Status atualizado: $oldStatus -> PROMPT_GERADO"
}

Write-Log "---"
Write-Log "PROMPT GERADO. Proximos passos:"
Write-Log "  1. Abra: $promptFile"
Write-Log "  2. Copie o conteudo para ChatGPT ou Claude."
Write-Log "  3. Cole a resposta em: $responseFile"
Write-Log "  4. Execute: agent_runtime.ps1 -ProjectName $ProjectName -AgentName $AgentName -Mode Ingest"
