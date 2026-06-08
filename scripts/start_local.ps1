param(
    [string]$Profile = "LOCAL_WINDOWS"
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Copy-Item ".env.local.example" $envFile
    Write-Host "Criado $envFile a partir de .env.local.example. Revise os segredos antes de producao."
}

foreach ($dir in @("data", "logs", "backups", "config")) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

$env:FACTORY_PROFILE = $Profile
docker compose --env-file $envFile -f docker-compose.local.yml up -d --build

$forjaPort = "8080"
$match = Get-Content $envFile | Select-String '^FORJA_OS_HOST_PORT=' | Select-Object -First 1
if ($match) {
    $forjaPort = $match.ToString().Split("=", 2)[1]
}

Write-Host "Fabrica iniciada em modo $Profile."
Write-Host "FORJA OS: http://localhost:$forjaPort"
