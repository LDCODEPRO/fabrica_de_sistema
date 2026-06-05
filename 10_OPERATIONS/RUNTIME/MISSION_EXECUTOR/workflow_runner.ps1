# =============================================================================
# WORKFLOW_RUNNER.PS1
# Fábrica de Sistemas — Runtime Component
# Executa o pipeline completo: localiza projetos pendentes e chama o
# MISSION_EXECUTOR para cada um.
# =============================================================================

param(
    # Raiz onde os projetos ficam (padrão: 15_PROJETOS ao lado da Fábrica)
    [string]$ProjectsRoot = "",

    # Executar apenas um projeto específico (opcional)
    [string]$ProjectName = "",

    # Modo dry-run: lista o que seria executado sem modificar arquivos
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Resolver raiz de projetos
# ---------------------------------------------------------------------------
$ScriptDir = $PSScriptRoot
$FabricaRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if (-not $ProjectsRoot) {
    $ProjectsRoot = Join-Path $FabricaRoot "15_PROJETOS"
}

if (-not (Test-Path $ProjectsRoot)) {
    Write-Error "WORKFLOW_RUNNER ERRO: Diretório de projetos nao encontrado: $ProjectsRoot"
    exit 1
}

$Executor = Join-Path $ScriptDir "mission_executor.ps1"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Write-Log {
    param([string]$Message)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] $Message"
}

# ---------------------------------------------------------------------------
# Descobrir projetos com MISSION_BOARD
# ---------------------------------------------------------------------------
Write-Log "Procurando projetos em: $ProjectsRoot"

if ($ProjectName) {
    $candidates = Get-ChildItem -Path $ProjectsRoot -Directory | Where-Object { $_.Name -eq $ProjectName }
} else {
    $candidates = Get-ChildItem -Path $ProjectsRoot -Directory
}

$pending = @()
foreach ($dir in $candidates) {
    $board = Join-Path $dir.FullName "MISSION_BOARD.md"
    if (-not (Test-Path $board)) { continue }

    # Verificar se projeto está pendente (não CONCLUIDO)
    $boardContent = Get-Content -Path $board -Encoding UTF8 -Raw
    if ($boardContent -match '\|\s*\*\*Status\*\*\s*\|\s*CONCLUIDO') { continue }

    $pending += $dir
}

if ($pending.Count -eq 0) {
    Write-Log "Nenhum projeto pendente encontrado."
    exit 0
}

Write-Log "Projetos pendentes encontrados: $($pending.Count)"

# ---------------------------------------------------------------------------
# Executar
# ---------------------------------------------------------------------------
$ok    = 0
$fail  = 0

foreach ($proj in $pending) {
    Write-Log "--- Projeto: $($proj.Name) ---"

    if ($DryRun) {
        Write-Log "[DRY-RUN] Executaria: $Executor -ProjectPath `"$($proj.FullName)`""
        $ok++
        continue
    }

    try {
        & $Executor -ProjectPath $proj.FullName
        $ok++
    } catch {
        Write-Log "ERRO ao executar $($proj.Name): $_"
        $fail++
    }
}

Write-Log "---"
Write-Log "Workflow concluido. OK: $ok | FALHA: $fail"
