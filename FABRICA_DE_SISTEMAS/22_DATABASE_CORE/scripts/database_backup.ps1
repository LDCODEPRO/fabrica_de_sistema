$ErrorActionPreference = "Stop"
$dbPath = "D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\fabricadb.sqlite"
$backupRoot = "D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\backups"
$dateStr = Get-Date -Format "yyyy-MM-dd"
$timeStr = Get-Date -Format "HHmmss"
$backupDir = Join-Path $backupRoot $dateStr

if (!(Test-Path $dbPath)) {
    Write-Host "Database não encontrado em $dbPath. Nada para fazer backup."
    exit 1
}

if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
}

$backupFile = Join-Path $backupDir "fabricadb_$timeStr.sqlite.bak"
Copy-Item -Path $dbPath -Destination $backupFile -Force
$size = (Get-Item $backupFile).Length

Write-Host "Backup criado com sucesso em: $backupFile (Tamanho: $size bytes)"

# Registra o evento no banco chamando Python
$pyScript = @"
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database_manager import DatabaseManager
from services.backup_service import BackupService

db = DatabaseManager(r'$dbPath')
svc = BackupService(db)
svc.register_backup(r'$backupFile', $size)
print('Evento de backup registrado no Database Core.')
"@

$pyFile = Join-Path $PSScriptRoot "temp_reg.py"
Set-Content -Path $pyFile -Value $pyScript -Encoding UTF8
python $pyFile
Remove-Item $pyFile -Force
