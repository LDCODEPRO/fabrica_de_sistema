# =============================================================================
# AGENT_DISPATCHER.PS1
# Fábrica de Sistemas — Runtime Component
# Recebe um agente e seu arquivo de tarefa, valida o conteúdo e registra
# o despacho. NÃO executa IA — apenas prepara e registra a missão.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$AgentName,

    [Parameter(Mandatory = $true)]
    [string]$TaskFile,

    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Validação
# ---------------------------------------------------------------------------
if (-not (Test-Path $TaskFile)) {
    Write-Error "DISPATCHER ERRO: Arquivo de tarefa nao encontrado: $TaskFile"
    exit 1
}

# ---------------------------------------------------------------------------
# Ler conteúdo da tarefa
# ---------------------------------------------------------------------------
$content = Get-Content -Path $TaskFile -Encoding UTF8 -Raw

# Extrair status atual
$currentStatus = "DESCONHECIDO"
if ($content -match '(?m)^## Status\s*\r?\n\s*\r?\n(.+)') {
    $currentStatus = $Matches[1].Trim()
}

# Extrair missão
$mission = ""
if ($content -match '(?ms)## Missão\s*\r?\n\s*\r?\n(.+?)(\r?\n##|\z)') {
    $mission = $Matches[1].Trim()
}

# Extrair tarefas pendentes
$pendingTasks = @($content -split "`n" | Where-Object { $_ -match '^\s*-\s*\[\s*\]' })

# ---------------------------------------------------------------------------
# Relatório de despacho
# ---------------------------------------------------------------------------
$dispatchReport = @"
DISPATCH_RECORD
  Agente      : $AgentName
  Arquivo     : $TaskFile
  Status      : $currentStatus
  Missao      : $mission
  Pendentes   : $($pendingTasks.Count) tarefa(s)
"@

# Gravar registro de despacho no projeto
$dispatchDir  = Join-Path $ProjectPath "_DISPATCH_LOG"
if (-not (Test-Path $dispatchDir)) {
    New-Item -ItemType Directory -Path $dispatchDir -Force | Out-Null
}

$dispatchFile = Join-Path $dispatchDir "$AgentName`_dispatch.txt"
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$entry = "[$ts]`n$dispatchReport`n`n"
Add-Content -Path $dispatchFile -Value $entry -Encoding UTF8

# Saída para o executor
Write-Output "DISPATCHED: $AgentName | $($pendingTasks.Count) tarefas pendentes | arquivo=$dispatchFile"
