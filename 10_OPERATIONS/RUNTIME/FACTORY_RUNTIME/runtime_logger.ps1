# =============================================================================
# RUNTIME_LOGGER.PS1
# Fabrica de Sistemas - Factory Runtime
# Gerencia o RUNTIME_LOG.md do factory_runtime.
# Dot-source este arquivo: . .\runtime_logger.ps1
# =============================================================================

# $Script:RUNTIME_LOG_PATH deve estar definido pelo runtime_config.ps1

function Initialize-RuntimeLog {
    if (-not (Test-Path $RUNTIME_LOG_PATH)) {
        $header = @(
            "# RUNTIME_LOG - FACTORY_RUNTIME",
            "",
            "| Data/Hora           | Projeto            | Etapa              | Resultado | Duracao(s) | Detalhe |",
            "|---------------------|--------------------|--------------------|-----------|------------|---------|"
        )
        Set-Content -Path $RUNTIME_LOG_PATH -Value ($header -join "`r`n") -Encoding UTF8
    }
}

function Write-RuntimeLog {
    param(
        [string]$Project,
        [string]$Stage,
        [string]$Result,       # OK | SKIP | FALHA | INFO
        [string]$Detail = "",
        [double]$Duration = 0
    )
    Initialize-RuntimeLog
    $ts  = Get-Date -Format "yyyy-MM-dd HH:mm"
    $dur = [math]::Round($Duration, 1)
    $line = "| $ts | $Project | $Stage | $Result | ${dur}s | $Detail |"
    $maxRetries = 4
    for ($i = 0; $i -lt $maxRetries; $i++) {
        try {
            Add-Content -Path $RUNTIME_LOG_PATH -Value $line -Encoding UTF8
            break
        } catch {
            Start-Sleep -Milliseconds 150
        }
    }
}

function Write-RuntimeConsole {
    param([string]$Stage, [string]$Msg, [string]$Level = "INFO")
    $ts = Get-Date -Format "HH:mm:ss"
    $prefix = switch ($Level) {
        "OK"    { "[OK]   " }
        "SKIP"  { "[SKIP] " }
        "FAIL"  { "[FAIL] " }
        "START" { "[....] " }
        default { "[INFO] " }
    }
    Write-Host "[$ts] $prefix $Stage : $Msg"
}
