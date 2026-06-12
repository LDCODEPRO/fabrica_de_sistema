# ============================================================
#  FORJA OS - Tunel publico 24/7 (Cloudflare quick tunnel)
#  Mantem o tunel vivo; a cada (re)inicio captura a URL nova,
#  atualiza PUBLIC_BASE_URL no .env e logs\ACESSO_PUBLICO.txt.
#  Tarefa agendada: FORJA_TUNNEL_24H (inicia no logon).
# ============================================================
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$cf = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\cloudflared.exe'
if (-not (Test-Path $cf)) {
    $cf = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Cloudflare.cloudflared*\cloudflared.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}
$log = Join-Path $root 'logs\tunnel.log'

function Write-Note($msg) {
    Add-Content -Path (Join-Path $root 'logs\servidor_24h.log') -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [tunel] $msg"
}

if (-not $cf) { Write-Note "cloudflared nao encontrado - tunel desativado"; exit 1 }

while ($true) {
    # Ja ha tunel vivo? So monitora.
    $alive = Get-Process cloudflared -ErrorAction SilentlyContinue
    if ($alive) { Start-Sleep -Seconds 60; continue }

    Write-Note "iniciando tunel cloudflared"
    if (Test-Path $log) { Remove-Item $log -Force -ErrorAction SilentlyContinue }
    $p = Start-Process -FilePath $cf -ArgumentList 'tunnel','--url','http://127.0.0.1:8000' `
        -WindowStyle Hidden -PassThru -RedirectStandardError $log

    # Captura a URL nova (aparece no log em ate ~30s)
    $url = $null
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 2
        if (Test-Path $log) {
            $m = Select-String -Path $log -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($m) { $url = $m.Matches[0].Value; break }
        }
    }

    if ($url) {
        Write-Note "tunel no ar: $url"
        # Atualiza PUBLIC_BASE_URL no .env (necessario p/ publicar no Instagram)
        $envPath = Join-Path $root '.env'
        $envTxt = if (Test-Path $envPath) { Get-Content $envPath -Raw } else { '' }
        if ($envTxt -match 'PUBLIC_BASE_URL=') {
            $envTxt = $envTxt -replace 'PUBLIC_BASE_URL=.*', "PUBLIC_BASE_URL=$url"
        } else {
            $envTxt = $envTxt.TrimEnd() + "`nPUBLIC_BASE_URL=$url`n"
        }
        Set-Content -Path $envPath -Value $envTxt -Encoding UTF8
        # Atualiza o arquivo de acesso com o link completo (token do .env)
        $tok = ([regex]::Match($envTxt, 'FORJA_PUBLIC_TOKEN=(\S+)')).Groups[1].Value
        Set-Content -Path (Join-Path $root 'logs\ACESSO_PUBLICO.txt') -Encoding UTF8 -Value @(
            "URL publica atual (muda a cada reinicio do tunel):",
            "$url/painel?key=$tok",
            "",
            "Atualizado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        )
    } else {
        Write-Note "tunel iniciou mas URL nao capturada (veja logs\tunnel.log)"
    }

    # Espera o tunel morrer; ao morrer, reinicia em 5s
    Wait-Process -Id $p.Id -ErrorAction SilentlyContinue
    Write-Note "tunel terminou - reinicio em 5s"
    Start-Sleep -Seconds 5
}
