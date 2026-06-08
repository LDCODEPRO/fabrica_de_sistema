$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$gemini = Join-Path $root ".tools\gemini\node_modules\.bin\gemini.cmd"

if (-not (Test-Path $gemini)) {
    Write-Host "Gemini não está instalado. Execute a instalação pela FORJA OS."
    exit 1
}

Set-Location $root
$env:GEMINI_CLI_HOME = Join-Path $root ".gemini-forja"
Write-Host "Entre com a conta Google vinculada à assinatura do Gemini."
Write-Host "No Gemini, use /auth caso a seleção de conta não apareça automaticamente."
& $gemini
