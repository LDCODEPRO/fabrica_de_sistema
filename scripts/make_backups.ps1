# scripts/make_backups.ps1
# Executa cópias de segurança (Backup local e Pendrive) e valida arquivos

$src = "D:\FABRICA_DE_SISTEMAS"
$local_backup = "D:\FABRICA_DE_SISTEMAS\V008"
$pendrive_backup = "F:\FABRICA_DE_SISTEMAS\V008"

# Exclusões
$exclude_dirs = @("V008", "node_modules", "__pycache__", ".npm-cache", ".pytest_cache", ".build-dist", ".build-tmp", ".pytest_basetemp", ".claude", ".tools", "_tmp_test_dir", ".pytest_basetemp")
$exclude_files = @("*.pyc", "*.pyo", "nexus.db-journal")

Write-Host "Iniciando cópia para o Backup Local: $local_backup..."
$xd_arg = $exclude_dirs -join " "
$xf_arg = $exclude_files -join " "

# Executa robocopy para local backup
Start-Process robocopy -ArgumentList "`"$src`" `"$local_backup`" /E /XD $xd_arg /XF $xf_arg /R:1 /W:1 /NFL /NDL" -NoNewWindow -Wait

Write-Host "Iniciando cópia para o Pendrive: $pendrive_backup..."
# Executa robocopy para pendrive
Start-Process robocopy -ArgumentList "`"$src`" `"$pendrive_backup`" /E /XD $xd_arg /XF $xf_arg /R:1 /W:1 /NFL /NDL" -NoNewWindow -Wait

# Validação do Pendrive
Write-Host "Validando integridade da cópia do Pendrive..."
if (Test-Path $pendrive_backup) {
    $files = Get-ChildItem -Path $pendrive_backup -File -Recurse
    $dirs = Get-ChildItem -Path $pendrive_backup -Directory -Recurse
    $total_size = ($files | Measure-Object -Property Length -Sum).Sum
    
    $file_count = $files.Count
    $dir_count = $dirs.Count
    
    Write-Host "--- ESTATÍSTICAS DO PENDRIVE ---"
    Write-Host "Total de arquivos: $file_count"
    Write-Host "Total de pastas: $dir_count"
    Write-Host "Tamanho total: $([Math]::Round($total_size / 1MB, 2)) MB"
    
    # Salva estatísticas em arquivo de texto
    $stats = @{
        files = $file_count
        folders = $dir_count
        size_mb = [Math]::Round($total_size / 1MB, 2)
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
    $stats | ConvertTo-Json | Set-Content (Join-Path $src "logs\backup_v008_stats.json")
} else {
    Write-Error "Erro: Cópia do pendrive não encontrada!"
}
