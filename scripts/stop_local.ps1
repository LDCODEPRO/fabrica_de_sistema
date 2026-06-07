$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    $envFile = ".env.example"
}

docker compose --env-file $envFile -f docker-compose.local.yml down
Write-Host "Fabrica local parada."
