# =============================================================================
# STATUS_UPDATER.PS1
# Fábrica de Sistemas — Runtime Component
# Atualiza o campo de Status em arquivos .md (task files e MISSION_BOARD).
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [Parameter(Mandatory = $true)]
    [string]$OldStatus,

    [Parameter(Mandatory = $true)]
    [string]$NewStatus,

    # Opcional: necessário ao atualizar MISSION_BOARD (identifica a linha do agente)
    [string]$AgentName = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Validação
# ---------------------------------------------------------------------------
if (-not (Test-Path $FilePath)) {
    Write-Error "STATUS_UPDATER ERRO: Arquivo nao encontrado: $FilePath"
    exit 1
}

$content = Get-Content -Path $FilePath -Encoding UTF8 -Raw
$updated = $false

# ---------------------------------------------------------------------------
# Modo MISSION_BOARD: atualiza célula de status na linha do agente
# ---------------------------------------------------------------------------
if ($AgentName -ne "" -and $FilePath -match "MISSION_BOARD") {
    # Linha do agente: | AGENT_NAME | TASK_FILE | STATUS |
    # Substituição precisa preservar as outras colunas
    $escapedAgent  = [Regex]::Escape($AgentName)
    $escapedStatus = [Regex]::Escape($OldStatus)
    $pattern = "(?m)(\|\s*$escapedAgent\s*\|[^|]+\|)\s*$escapedStatus\s*(\|)"
    if ($content -match $pattern) {
        $content = $content -replace $pattern, "`${1} $NewStatus `$2"
        $updated = $true
    }
}

# ---------------------------------------------------------------------------
# Modo TASK FILE: atualiza bloco "## Status\n\nVALOR"
# ---------------------------------------------------------------------------
if (-not $updated) {
    $escapedStatus = [Regex]::Escape($OldStatus)
    $pattern = "(?m)(^## Status\s*\r?\n\s*\r?\n)$escapedStatus"
    if ($content -match $pattern) {
        $content = $content -replace $pattern, "`${1}$NewStatus"
        $updated = $true
    }
}

# ---------------------------------------------------------------------------
# Salvar ou reportar
# ---------------------------------------------------------------------------
if ($updated) {
    Set-Content -Path $FilePath -Value $content -Encoding UTF8 -NoNewline
    Write-Output "UPDATED: $FilePath | $OldStatus → $NewStatus"
} else {
    Write-Output "NO_CHANGE: Status '$OldStatus' nao encontrado em $FilePath"
}
