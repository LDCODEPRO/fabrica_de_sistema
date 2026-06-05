# =============================================================================
# MISSION_BOARD_AUDITOR.PS1
# Fabrica de Sistemas - Audit Engine Component
# Valida estrutura e consistencia do MISSION_BOARD.md de um projeto.
# Saida: JSON com lista de issues encontradas.
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Status validos reconhecidos pela Fabrica
$VALID_STATUSES = @(
    "AGUARDANDO", "EM EXECUCAO", "EM ORQUESTRACAO",
    "CONCLUIDO", "REPROVADO", "BLOQUEADO",
    "MISSOES GERADAS", "PENDENTE"
)

# ---------------------------------------------------------------------------
# Resultado base
# ---------------------------------------------------------------------------
$result = [PSCustomObject]@{
    Component = "MISSION_BOARD"
    Issues    = @()
    Agents    = @()
    BoardStatus = ""
}

function Add-Issue {
    param([string]$Severity, [string]$Code, [string]$Message)
    $result.Issues += [PSCustomObject]@{ Severity = $Severity; Code = $Code; Message = $Message }
}

# ---------------------------------------------------------------------------
# Verificacao 1: existencia do MISSION_BOARD
# ---------------------------------------------------------------------------
$boardPath = Join-Path $ProjectPath "MISSION_BOARD.md"
if (-not (Test-Path $boardPath)) {
    Add-Issue "CRITICAL" "MB001" "MISSION_BOARD.md nao encontrado no projeto"
    Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
    exit 0
}

$content = Get-Content -Path $boardPath -Encoding UTF8 -Raw
$lines   = Get-Content -Path $boardPath -Encoding UTF8

# ---------------------------------------------------------------------------
# Verificacao 2: arquivo vazio
# ---------------------------------------------------------------------------
if ([string]::IsNullOrWhiteSpace($content)) {
    Add-Issue "CRITICAL" "MB002" "MISSION_BOARD.md existe mas esta vazio"
    Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
    exit 0
}

# ---------------------------------------------------------------------------
# Verificacao 3: campos obrigatorios presentes
# ---------------------------------------------------------------------------
$requiredFields = @("Projeto", "Status", "Tipo", "Etapa Atual")
foreach ($field in $requiredFields) {
    if ($content -notmatch "\*\*$field\*\*") {
        Add-Issue "MEDIUM" "MB003" "Campo obrigatorio ausente no MISSION_BOARD: $field"
    }
}

# ---------------------------------------------------------------------------
# Verificacao 4: status do board e valido
# ---------------------------------------------------------------------------
$boardStatus = ""
foreach ($line in $lines) {
    if ($line -match '\|\s*\*\*Status\*\*\s*\|\s*(.+?)\s*\|') {
        $boardStatus = $Matches[1].Trim()
        break
    }
}
$result.BoardStatus = $boardStatus

if (-not $boardStatus) {
    Add-Issue "HIGH" "MB004" "Status do projeto nao encontrado no MISSION_BOARD"
} elseif ($VALID_STATUSES -notcontains $boardStatus) {
    Add-Issue "MEDIUM" "MB005" "Status do MISSION_BOARD invalido ou nao reconhecido: '$boardStatus'"
}

# ---------------------------------------------------------------------------
# Verificacao 5: tabela de agentes presente e preenchida
# ---------------------------------------------------------------------------
$agentLines = @($lines | Where-Object { $_ -match '_AGENT' -and $_ -match '\|' })

if ($agentLines.Count -eq 0) {
    Add-Issue "HIGH" "MB006" "Tabela de agentes ausente ou sem agentes no MISSION_BOARD"
} else {
    $agentList = @()
    foreach ($line in $agentLines) {
        $parts = ($line -split '\|') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
        if ($parts.Count -ge 3) {
            $agentStatus = $parts[2]
            if ($VALID_STATUSES -notcontains $agentStatus) {
                Add-Issue "MEDIUM" "MB007" "Agente '$($parts[0])' com status invalido: '$agentStatus'"
            }
            $agentList += [PSCustomObject]@{
                Agent    = $parts[0]
                TaskFile = $parts[1]
                Status   = $agentStatus
            }
        }
    }
    $result.Agents = $agentList
}

# ---------------------------------------------------------------------------
# Verificacao 6: log de orquestracao presente
# ---------------------------------------------------------------------------
if ($content -notmatch '## Log') {
    Add-Issue "LOW" "MB008" "Secao de log de orquestracao ausente no MISSION_BOARD"
}

# ---------------------------------------------------------------------------
# Saida
# ---------------------------------------------------------------------------
Write-Output ($result | ConvertTo-Json -Depth 4 -Compress)
