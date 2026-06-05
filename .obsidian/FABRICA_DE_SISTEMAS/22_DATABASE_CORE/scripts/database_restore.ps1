param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFilePath
)

$ErrorActionPreference = "Stop"
$dbPath = "D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\fabricadb.sqlite"

if (!(Test-Path $BackupFilePath)) {
    Write-Host "Arquivo de backup não encontrado: $BackupFilePath"
    exit 1
}

Write-Host "Aviso: Isso irá sobrescrever o banco de dados atual!"
Copy-Item -Path $BackupFilePath -Destination $dbPath -Force
Write-Host "Database restaurado com sucesso a partir de $BackupFilePath"
