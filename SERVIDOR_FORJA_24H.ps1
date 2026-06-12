# ============================================================
#  FORJA OS - Servidor 24/7 (modo hospedagem local / "VPS")
#  Mantem o backend SEMPRE no ar: roda o python em foreground;
#  se cair, reinicia em 5s. Log unico com append (sem lock).
#  Usado pela tarefa agendada "FORJA_OS_24H" (inicia no logon).
# ============================================================
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = if ($env:PORT) { $env:PORT } else { '8000' }
$log  = Join-Path $root 'logs\servidor_24h.log'
if (-not (Test-Path "$root\logs")) { New-Item -ItemType Directory -Path "$root\logs" | Out-Null }

function Write-Log($msg) {
    Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
}

Write-Log "=== FORJA 24H iniciado (porta $port) ==="

while ($true) {
    # Ja ha servidor saudavel no ar? So monitora.
    $up = $false
    try {
        $h = Invoke-RestMethod "http://127.0.0.1:$port/api/health" -TimeoutSec 3
        if ($h.status -eq 'ok') { $up = $true }
    } catch { }
    if ($up) { Start-Sleep -Seconds 30; continue }

    # Mata instancia zumbi (viva mas sem responder) antes de subir outra
    Get-CimInstance Win32_Process -Filter "Name='python.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*forja_os_server*' } |
        ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force } catch {}; Write-Log "zumbi PID=$($_.ProcessId) encerrado" }
    Start-Sleep -Seconds 2

    # Rotacao simples do log do servidor
    $srvlog = Join-Path $root 'logs\srv24.log'
    if ((Test-Path $srvlog) -and ((Get-Item $srvlog).Length -gt 20MB)) {
        Move-Item $srvlog "$srvlog.old" -Force
    }

    Write-Log "iniciando forja_os_server.py (foreground)"
    $env:PORT = $port
    # Foreground: bloqueia aqui enquanto o servidor vive; append nao trava arquivo
    cmd /c "python forja_os_server.py >> `"$srvlog`" 2>&1"
    Write-Log "servidor terminou (exit=$LASTEXITCODE) - reinicio em 5s"
    Start-Sleep -Seconds 5
}
