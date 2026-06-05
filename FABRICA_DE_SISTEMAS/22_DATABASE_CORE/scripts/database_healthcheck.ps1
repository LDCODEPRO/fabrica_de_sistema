$ErrorActionPreference = "Stop"
$dbPath = "D:\fabricadesistema\FABRICA_DE_SISTEMAS\22_DATABASE_CORE\fabricadb.sqlite"

# Chamando o healthcheck do database_manager.py
$pyScript = @"
import sys
import os
import json
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database_manager import DatabaseManager

db = DatabaseManager(r'$dbPath')
status = db.health_check()
print(json.dumps(status))
"@

$pyFile = Join-Path $PSScriptRoot "temp_health.py"
Set-Content -Path $pyFile -Value $pyScript -Encoding UTF8
$result = python $pyFile
Remove-Item $pyFile -Force

Write-Host "HEALTH CHECK RESULTADO:"
Write-Host $result
