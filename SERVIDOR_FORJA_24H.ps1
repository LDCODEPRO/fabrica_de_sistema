# ============================================================
#  FORJA OS - Servidor 24/7 (modo hospedagem local / "VPS")
#  Mantem o backend SEMPRE no ar. Inicia o python como processo
#  filho monitorado; se cair (ou ficar zumbi sem responder ao
#  /api/health), reinicia. Robusto: nunca morre junto com o python.
#  Tarefa agendada: FORJA_OS_24H (logon).
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

function Test-Health {
    try {
        $h = Invoke-RestMethod "http://127.0.0.1:$port/api/health" -TimeoutSec 4
        return ($h.status -eq 'ok')
    } catch { return $false }
}

Write-Log "=== FORJA 24H iniciado (porta $port) ==="
$proc = $null

while ($true) {
    try {
        # Servidor saudavel? segue monitorando a cada 20s.
        if (Test-Health) { Start-Sleep -Seconds 20; continue }

        # Nao respondeu: encerra processo atual (se houver) e zumbis.
        if ($proc -and -not $proc.HasExited) {
            try { Stop-Process -Id $proc.Id -Force } catch {}
        }
        Get-CimInstance Win32_Process -Filter "Name='python.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -like '*forja_os_server*' } |
            ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force } catch {}; Write-Log "zumbi PID=$($_.ProcessId) encerrado" }
        Start-Sleep -Seconds 2

        # Rotacao do log do servidor
        $srvlog = Join-Path $root 'logs\srv24.log'
        if ((Test-Path $srvlog) -and ((Get-Item $srvlog).Length -gt 20MB)) {
            Move-Item $srvlog "$srvlog.old" -Force
        }

        Write-Log "subindo forja_os_server.py"
        $env:PORT = $port
        # Processo FILHO monitorado (nao bloqueia o supervisor)
        $proc = Start-Process -FilePath 'python' -ArgumentList 'forja_os_server.py' `
            -WorkingDirectory $root -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput $srvlog -RedirectStandardError "$srvlog.err"

        # Aguarda ficar saudavel (ate 40s); se nao, loga e o loop tenta de novo
        $ok = $false
        for ($i = 0; $i -lt 20; $i++) {
            Start-Sleep -Seconds 2
            if (Test-Health) { $ok = $true; break }
            if ($proc.HasExited) { break }
        }
        if ($ok) { Write-Log "servidor no ar PID=$($proc.Id)" }
        else { Write-Log "servidor nao respondeu a tempo (PID=$($proc.Id), exited=$($proc.HasExited)) - retry" }
    } catch {
        Write-Log "loop erro: $($_.Exception.Message)"
        Start-Sleep -Seconds 5
    }
}
