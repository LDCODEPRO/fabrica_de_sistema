# ============================================================
#  FORJA OS — Abrir Painel (boot do backend + navegador)
#  Sobe o FastAPI (forja_os_server.py) e abre o painel real.
#  Se o servidor já estiver no ar, apenas abre o navegador.
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = if ($env:PORT) { $env:PORT } else { '8000' }
$base = "http://127.0.0.1:$port"
$painel = "$base/painel"

function Test-Health {
    try {
        $r = Invoke-RestMethod "$base/api/health" -TimeoutSec 2
        return ($r.status -eq 'ok')
    } catch { return $false }
}

Write-Host "FORJA OS - iniciando painel..." -ForegroundColor Cyan

# 1) Localiza o Python
$py = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $py) { $py = (Get-Command py -ErrorAction SilentlyContinue).Source }
if (-not $py) {
    Write-Host "ERRO: Python nao encontrado no PATH. Instale o Python 3.11+." -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"
    exit 1
}

# 2) Sobe o servidor apenas se ainda nao estiver no ar
if (Test-Health) {
    Write-Host "Backend ja esta no ar em $base" -ForegroundColor Green
} else {
    Write-Host "Subindo backend (forja_os_server.py) na porta $port..." -ForegroundColor Yellow
    if (-not (Test-Path "$root\logs")) { New-Item -ItemType Directory -Path "$root\logs" | Out-Null }
    $env:PORT = $port
    Start-Process -FilePath $py -ArgumentList "forja_os_server.py" -WorkingDirectory $root `
        -WindowStyle Hidden `
        -RedirectStandardOutput "$root\logs\painel_forja.out.log" `
        -RedirectStandardError  "$root\logs\painel_forja.err.log" | Out-Null

    # 3) Aguarda o health responder (ate ~30s)
    $ok = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        if (Test-Health) { $ok = $true; break }
    }
    if ($ok) {
        Write-Host "Backend pronto em $base" -ForegroundColor Green
    } else {
        Write-Host "AVISO: backend nao respondeu a tempo. Veja logs\painel_forja.err.log" -ForegroundColor Red
        Write-Host "Abrindo o painel mesmo assim..." -ForegroundColor Yellow
    }
}

# 4) Abre o painel no navegador padrao
Write-Host "Abrindo painel: $painel" -ForegroundColor Cyan
Start-Process $painel
