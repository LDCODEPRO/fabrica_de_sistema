# scripts/create_zip.ps1
# Cria o arquivo ZIP portável a partir da pasta V008 e copia para os destinos

$v008_path = "D:\FABRICA_DE_SISTEMAS\V008"
$local_zip = "D:\FABRICA_DE_SISTEMAS\FORJA_V008_STABLE.zip"
$pendrive_zip = "F:\FABRICA_DE_SISTEMAS\FORJA_V008_STABLE.zip"

Write-Host "Iniciando compressão da pasta V008..."
if (Test-Path $local_zip) {
    Remove-Item -Path $local_zip -Force
}

# Comprime a pasta V008
Compress-Archive -Path "$v008_path\*" -DestinationPath $local_zip -Force

Write-Host "Copiando ZIP para o Pendrive..."
if (-not (Test-Path (Split-Path $pendrive_zip -Parent))) {
    New-Item -ItemType Directory -Force -Path (Split-Path $pendrive_zip -Parent) | Out-Null
}
Copy-Item -Path $local_zip -Destination $pendrive_zip -Force

# Validação de integridade do ZIP
Write-Host "Validando integridade do arquivo ZIP..."
if ((Test-Path $local_zip) -and (Test-Path $pendrive_zip)) {
    $local_size = (Get-Item $local_zip).Length
    $pendrive_size = (Get-Item $pendrive_zip).Length
    Write-Host "ZIP Local gerado com: $([Math]::Round($local_size / 1MB, 2)) MB"
    Write-Host "ZIP Pendrive gerado com: $([Math]::Round($pendrive_size / 1MB, 2)) MB"
} else {
    Write-Error "Erro ao validar os arquivos ZIP!"
}
