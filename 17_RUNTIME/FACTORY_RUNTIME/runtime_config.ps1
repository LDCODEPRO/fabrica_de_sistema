# =============================================================================
# RUNTIME_CONFIG.PS1
# Fabrica de Sistemas - Factory Runtime
# Define e exporta todos os caminhos canonicos da Fabrica.
# Deve ser "dot-sourced" pelo factory_runtime.ps1: . .\runtime_config.ps1
# =============================================================================

# ---------------------------------------------------------------------------
# Raiz da Fabrica (detectada automaticamente a partir deste script)
# ---------------------------------------------------------------------------
# Este arquivo fica em 17_RUNTIME\FACTORY_RUNTIME\
# Logo: ..\..\  = FABRICA_DE_SISTEMAS\
$Script:FABRICA_ROOT = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

# ---------------------------------------------------------------------------
# Diretorios principais
# ---------------------------------------------------------------------------
$Script:PROJECTS_DIR    = Join-Path $FABRICA_ROOT "15_PROJETOS"
$Script:RUNTIME_DIR     = Join-Path $FABRICA_ROOT "17_RUNTIME"
$Script:RELATORIOS_DIR  = Join-Path $FABRICA_ROOT "19_RELATORIOS"
$Script:SISTEMAS_DIR    = Join-Path $FABRICA_ROOT "16_SISTEMAS"

# ---------------------------------------------------------------------------
# Motores do runtime
# ---------------------------------------------------------------------------
$Script:ORCHESTRATOR_SCRIPT  = Join-Path $SISTEMAS_DIR "PROJECT_ORCHESTRATOR\orchestrate.ps1"
$Script:EXECUTOR_SCRIPT      = Join-Path $RUNTIME_DIR  "MISSION_EXECUTOR\mission_executor.ps1"
$Script:AGENT_RUNTIME_SCRIPT = Join-Path $RUNTIME_DIR  "AGENT_RUNTIME\agent_runtime.ps1"
$Script:STATUS_SCRIPT        = Join-Path $RUNTIME_DIR  "STATUS_ENGINE\status_engine.ps1"
$Script:AUDIT_SCRIPT         = Join-Path $RUNTIME_DIR  "AUDIT_ENGINE\audit_engine.ps1"

# ---------------------------------------------------------------------------
# Arquivos de saida do runtime
# ---------------------------------------------------------------------------
$Script:RUNTIME_LOG_PATH    = Join-Path $PSScriptRoot "RUNTIME_LOG.md"
$Script:EXEC_REPORT_PATH    = Join-Path $RELATORIOS_DIR "FACTORY_RUNTIME_EXECUTION_REPORT.md"
$Script:STATUS_DASHBOARD    = Join-Path $RELATORIOS_DIR "FACTORY_STATUS_DASHBOARD.md"
$Script:AUDIT_REPORT        = Join-Path $RELATORIOS_DIR "FACTORY_AUDIT_REPORT.md"
$Script:EXECUTOR_LOG        = Join-Path $RUNTIME_DIR   "MISSION_EXECUTOR\STATUS_LOG.md"

# ---------------------------------------------------------------------------
# Verificacao de integridade dos motores
# ---------------------------------------------------------------------------
function Test-RuntimeIntegrity {
    $missing = @()
    if (-not (Test-Path $ORCHESTRATOR_SCRIPT)) { $missing += "ORCHESTRATOR ($ORCHESTRATOR_SCRIPT)" }
    if (-not (Test-Path $EXECUTOR_SCRIPT))     { $missing += "MISSION_EXECUTOR ($EXECUTOR_SCRIPT)" }
    if (-not (Test-Path $STATUS_SCRIPT))       { $missing += "STATUS_ENGINE ($STATUS_SCRIPT)" }
    if (-not (Test-Path $AUDIT_SCRIPT))        { $missing += "AUDIT_ENGINE ($AUDIT_SCRIPT)" }
    return $missing
}
