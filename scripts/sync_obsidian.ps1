# scripts/sync_obsidian.ps1
# Script de sincronização para o vault do Obsidian

$src = "d:\FABRICA_DE_SISTEMAS"
$dst = "D:\fabricadesistema"

Write-Host "Iniciando sincronização com Obsidian..."

# Garante que a pasta de destino existe
if (-not (Test-Path $dst)) {
    New-Item -ItemType Directory -Force -Path $dst | Out-Null
}

$folders = @(
    @{ src = "19_RELATORIOS"; dst = "19_RELATORIOS" },
    @{ src = "05_AGENTS"; dst = "20_AGENTS" },
    @{ src = "05_AGENTS"; dst = "05_AGENTS" },
    @{ src = "01_RULES"; dst = "RULES" },
    @{ src = "01_RULES"; dst = "01_RULES" },
    @{ src = "02_WORKFLOWS"; dst = "WORKFLOWS" },
    @{ src = "02_WORKFLOWS"; dst = "02_WORKFLOWS" },
    @{ src = "03_SKILLS"; dst = "SKILLS" },
    @{ src = "03_SKILLS"; dst = "03_SKILLS" },
    @{ src = "FABRICA_DE_SISTEMAS\22_DATABASE_CORE"; dst = "22_DATABASE_CORE" },
    @{ src = "14_DOCUMENTACAO"; dst = "14_DOCUMENTACAO" }
)

foreach ($f in $folders) {
    $sDir = Join-Path $src $f.src
    $dDir = Join-Path $dst $f.dst
    if (Test-Path $sDir) {
        Write-Host "Copiando $sDir para $dDir..."
        if (Test-Path $dDir) {
            Remove-Item -Path $dDir -Recurse -Force
        }
        $parent = Split-Path $dDir -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }
        Copy-Item -Path $sDir -Destination $dDir -Recurse -Force
    } else {
        Write-Warning "Diretório de origem não encontrado: $sDir"
    }
}

# Arquivos individuais
Copy-Item -Path (Join-Path $src "CHANGELOG.md") -Destination (Join-Path $dst "CHANGELOG.md") -Force
Copy-Item -Path (Join-Path $src "19_RELATORIOS\VERSION_V008_CHAT_STABLE_MANIFEST.md") -Destination (Join-Path $dst "VERSION_V008_CHAT_STABLE_MANIFEST.md") -Force

Write-Host "Sincronização com Obsidian concluída com sucesso."
