# =============================================================================
# STATUS_ENGINE.PS1
# Fabrica de Sistemas - Runtime Component
# Escaneia 15_PROJETOS, le status de cada projeto e gera o dashboard.
# =============================================================================

param(
    # Raiz da Fabrica (detectada automaticamente se omitida)
    [string]$FabricaRoot = "",

    # Caminho customizado para a pasta de projetos
    [string]$ProjectsRoot = "",

    # Caminho customizado para o dashboard de saida
    [string]$DashboardPath = "",

    # Processar apenas um projeto especifico
    [string]$ProjectName = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Resolver caminhos
# ---------------------------------------------------------------------------
$ScriptDir = $PSScriptRoot

if (-not $FabricaRoot) {
    # Assume: 17_RUNTIME\STATUS_ENGINE\ -> 17_RUNTIME\ -> FABRICA_DE_SISTEMAS\
    $FabricaRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent
}

if (-not $ProjectsRoot) {
    $ProjectsRoot = Join-Path $FabricaRoot "15_PROJETOS"
}

if (-not $DashboardPath) {
    $RelatoriosDir = Join-Path $FabricaRoot "19_RELATORIOS"
    $DashboardPath = Join-Path $RelatoriosDir "FACTORY_STATUS_DASHBOARD.md"
}

$Reader    = Join-Path $ScriptDir "project_status_reader.ps1"
$Generator = Join-Path $ScriptDir "status_dashboard_generator.ps1"
$StatusLog = Join-Path (Split-Path $ScriptDir -Parent) "MISSION_EXECUTOR\STATUS_LOG.md"

# ---------------------------------------------------------------------------
# Validacoes
# ---------------------------------------------------------------------------
if (-not (Test-Path $ProjectsRoot)) {
    Write-Error "STATUS_ENGINE ERRO: Pasta de projetos nao encontrada: $ProjectsRoot"
    exit 1
}
if (-not (Test-Path $Reader)) {
    Write-Error "STATUS_ENGINE ERRO: project_status_reader.ps1 nao encontrado."
    exit 1
}
if (-not (Test-Path $Generator)) {
    Write-Error "STATUS_ENGINE ERRO: status_dashboard_generator.ps1 nao encontrado."
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

# ---------------------------------------------------------------------------
# 1. Descobrir projetos
# ---------------------------------------------------------------------------
Write-Log "Escaneando projetos em: $ProjectsRoot"

if ($ProjectName) {
    $projectDirs = Get-ChildItem -Path $ProjectsRoot -Directory | Where-Object { $_.Name -eq $ProjectName }
} else {
    $projectDirs = Get-ChildItem -Path $ProjectsRoot -Directory
}

if ($projectDirs.Count -eq 0) {
    Write-Log "Nenhum projeto encontrado."
    exit 0
}

Write-Log "Projetos encontrados: $($projectDirs.Count)"

# ---------------------------------------------------------------------------
# 2. Ler status de cada projeto
# ---------------------------------------------------------------------------
$allProjects = @()
$readErrors  = 0

foreach ($dir in $projectDirs) {
    Write-Log "Lendo: $($dir.Name)"
    try {
        $json = & $Reader -ProjectPath $dir.FullName 2>&1
        # Filtrar apenas a linha JSON (ultima linha com '{')
        $jsonLine = ($json | Where-Object { $_ -match '^\{' } | Select-Object -Last 1)
        if ($jsonLine) {
            $obj = $jsonLine | ConvertFrom-Json
            $allProjects += $obj
            Write-Log "  Status: $($obj.Status) | Agentes: $($obj.Agents.Count) | Tasks: $($obj.Tasks.Count)"
        } else {
            Write-Log "  AVISO: nenhum JSON retornado para $($dir.Name)"
            $readErrors++
        }
    } catch {
        Write-Log "  ERRO ao ler $($dir.Name): $_"
        $readErrors++
    }
}

Write-Log "Leitura concluida. OK: $($allProjects.Count) | Erros: $readErrors"

# ---------------------------------------------------------------------------
# 3. Serializar e chamar o generator
# ---------------------------------------------------------------------------
$projectsJson = $allProjects | ConvertTo-Json -Depth 5 -Compress

Write-Log "Gerando dashboard: $DashboardPath"

$genArgs = @{
    ProjectsJson = $projectsJson
    OutputPath   = $DashboardPath
}
if (Test-Path $StatusLog) {
    $genArgs.StatusLogPath = $StatusLog
}

$genOut = & $Generator @genArgs 2>&1
Write-Log "Generator: $genOut"

# ---------------------------------------------------------------------------
# 4. Resumo
# ---------------------------------------------------------------------------
Write-Log "---"
Write-Log "STATUS_ENGINE concluido."
Write-Log "Dashboard: $DashboardPath"
if (Test-Path $DashboardPath) {
    $size = (Get-Item $DashboardPath).Length
    Write-Log "Tamanho: $size bytes"
}
