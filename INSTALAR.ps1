# ============================================================
#  FABRICA DE SISTEMA - Instalacao em maquina nova (1 clique)
#  Instala dependencias, cria o .env (pede so a chave) e valida.
#  Depois: rode ABRIR_PAINEL_FORJA.cmd
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host ""
Write-Host "=== Instalacao da Fabrica de Sistema ===" -ForegroundColor Cyan
Write-Host ""

# 1) Python
$py = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $py) { $py = (Get-Command py -ErrorAction SilentlyContinue).Source }
if (-not $py) {
    Write-Host "Python nao encontrado. Instale o Python 3.11+ (marque 'Add to PATH') e rode de novo." -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"; exit 1
}
Write-Host "Python OK: $py" -ForegroundColor Green

# 2) Dependencias Python
Write-Host "Instalando dependencias Python (fastapi, uvicorn, pillow, etc.)..." -ForegroundColor Yellow
try { python -m pip install --upgrade pip --quiet } catch {}
python -m pip install --quiet -r requirements.txt
Write-Host "Dependencias Python instaladas." -ForegroundColor Green

# 3) .env (chave do OpenRouter) - escrito SEM BOM para o servidor ler certo
$envf = Join-Path $root ".env"
if (Test-Path $envf) {
    Write-Host ".env ja existe - mantendo o atual." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Cole a CHAVE do OpenRouter (comeca com sk-or-...)." -ForegroundColor Cyan
    Write-Host "Pegue/gere em: https://openrouter.ai/keys" -ForegroundColor Cyan
    $key = Read-Host "OPENROUTER_API_KEY"
    if ([string]::IsNullOrWhiteSpace($key)) {
        Write-Host "Sem chave - criando .env vazio (configure depois no painel: Integracoes/Cofre)." -ForegroundColor Yellow
        $key = ""
    }
    $content = "OPENROUTER_API_KEY=$key`nOPENROUTER_MODEL=deepseek/deepseek-v4-pro`n"
    [System.IO.File]::WriteAllText($envf, $content)
    Write-Host ".env criado." -ForegroundColor Green
}

# 4) Dependencias do painel (Node/npm) - opcional (o painel ja vem pronto em dist/)
$plat = Join-Path $root "16_SISTEMAS\FORJA_OS_PLATFORM"
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($node -and (Test-Path (Join-Path $plat "package.json"))) {
    Write-Host "Instalando dependencias do painel (npm)..." -ForegroundColor Yellow
    Push-Location $plat
    try { npm install --silent } catch { Write-Host "npm install falhou (opcional - so para reconstruir o painel)." -ForegroundColor Yellow }
    Pop-Location
} else {
    Write-Host "Node nao encontrado - tudo bem: o painel ja vem pronto (dist). (npm e opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== PRONTO! Instalacao concluida. ===" -ForegroundColor Green
Write-Host "Agora rode: ABRIR_PAINEL_FORJA.cmd (duplo clique)" -ForegroundColor Cyan
Write-Host "As LLMs serao validadas automaticamente quando o painel abrir." -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione ENTER para fechar"
