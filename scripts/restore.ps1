param(
    [Parameter(Mandatory = $true)]
    [string]$BackupFile,
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

$source = $BackupFile
if (-not (Test-Path $source)) {
    $source = Join-Path $backupDir $BackupFile
}
if (-not (Test-Path $source)) {
    throw "Backup nao encontrado: $BackupFile"
}

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir | Out-Null
}

$target = Join-Path $dataDir $dbFile
Copy-Item $source $target -Force

Write-Host "Banco restaurado em: $target"
