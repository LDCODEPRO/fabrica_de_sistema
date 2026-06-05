# =============================================================================
# RUNTIME_VALIDATOR.PS1
# Fabrica de Sistemas - Factory Runtime
# Valida pre-condicoes antes da execucao do pipeline.
# Dot-source este arquivo: . .\runtime_validator.ps1
# =============================================================================

# Depende de: runtime_config.ps1 (PROJECTS_DIR, Test-RuntimeIntegrity)

function Confirm-ProjectExists {
    param([string]$ProjectName)
    $path = Join-Path $PROJECTS_DIR $ProjectName
    if (-not (Test-Path $path -PathType Container)) {
        return @{ OK = $false; Message = "Projeto '$ProjectName' nao encontrado em $PROJECTS_DIR" }
    }
    return @{ OK = $true; Path = $path; Message = "Projeto encontrado: $path" }
}

function Confirm-ProjectReadme {
    param([string]$ProjectPath)
    $readme = Join-Path $ProjectPath "README.md"
    if (-not (Test-Path $readme)) {
        return @{ OK = $false; Message = "README.md ausente - necessario para o ORCHESTRATOR" }
    }
    return @{ OK = $true; Message = "README.md presente" }
}

function Get-OrchestratorStatus {
    param([string]$ProjectPath)
    $board = Join-Path $ProjectPath "MISSION_BOARD.md"
    if (Test-Path $board) {
        return @{ Orchestrated = $true; Message = "MISSION_BOARD.md ja existe - projeto ja orquestrado" }
    }
    return @{ Orchestrated = $false; Message = "MISSION_BOARD.md ausente - orquestracao necessaria" }
}

function Confirm-EnginesAvailable {
    $missing = @(Test-RuntimeIntegrity)
    if ($missing.Count -gt 0) {
        return @{ OK = $false; Missing = $missing; Message = "Motores ausentes: $($missing -join ' | ')" }
    }
    return @{ OK = $true; Missing = @(); Message = "Todos os motores disponiveis" }
}

function Invoke-PreflightChecks {
    param([string]$ProjectName)

    $checks = @{}

    # 1. Projeto existe
    $projCheck = Confirm-ProjectExists -ProjectName $ProjectName
    $checks.ProjectExists = $projCheck
    if (-not $projCheck.OK) { return $checks }

    # 2. README presente
    $readmeCheck = Confirm-ProjectReadme -ProjectPath $projCheck.Path
    $checks.ReadmeExists = $readmeCheck

    # 3. Status de orquestracao
    $orchCheck = Get-OrchestratorStatus -ProjectPath $projCheck.Path
    $checks.OrchestratorStatus = $orchCheck

    # 4. Motores disponiveis
    $engCheck = Confirm-EnginesAvailable
    $checks.EnginesAvailable = $engCheck

    return $checks
}
