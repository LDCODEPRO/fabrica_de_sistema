param(
    [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

function Get-EnvValue {
    param([string]$Name, [string]$Default)
    if (Test-Path $EnvFile) {
        $line = Get-Content $EnvFile | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
        if ($line) { return $line.Split("=", 2)[1].Trim('"') }
    }
    if (Test-Path ".env") {
        $line = Get-Content ".env" | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
        if ($line) { return $line.Split("=", 2)[1].Trim('"') }
    }
    return $Default
}

$dataDir = Get-EnvValue "FACTORY_DATA_DIR" "./data"
$backupDir = Get-EnvValue "FACTORY_BACKUP_DIR" "./backups"
$dbFile = Get-EnvValue "FACTORY_DATABASE_FILE" "nexus.db"

$dbPath = Join-Path $dataDir $dbFile
if (-not (Test-Path $dbPath)) {
    throw "Banco nao encontrado: $dbPath"
}

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$target = Join-Path $backupDir "nexus_$stamp.db"
Copy-Item $dbPath $target -Force

Write-Host "Backup criado: $target"
