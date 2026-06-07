# Walkthrough - Portabilidade e Implantacao

## Perfis suportados

- `LOCAL_WINDOWS`: uso no PC local com PowerShell e Docker Desktop.
- `PORTABLE_USB`: mesma configuracao local, com dados relativos a pasta copiada.
- `VPS_LINUX`: uso futuro em servidor Linux com Docker Compose.

## Preparar ambiente local

```powershell
Copy-Item .env.local.example .env.local
notepad .env.local
.\scripts\start_local.ps1
```

Parar:

```powershell
.\scripts\stop_local.ps1
```

## Preparar pendrive

1. Copiar a pasta completa da Fabrica.
2. Manter os diretorios relativos:
   - `data`
   - `logs`
   - `backups`
   - `config`
3. Usar `.env.local` com:

```text
FACTORY_DATA_DIR=./data
FACTORY_LOG_DIR=./logs
FACTORY_BACKUP_DIR=./backups
FACTORY_CONFIG_DIR=./config
```

## Preparar VPS Linux

```sh
cp .env.vps.example .env.vps
vi .env.vps
sh scripts/start_vps.sh
```

Parar:

```sh
sh scripts/stop_vps.sh
```

## Backup

Windows:

```powershell
.\scripts\backup.ps1
```

Linux:

```sh
sh scripts/backup.sh
```

## Restore

Windows:

```powershell
.\scripts\restore.ps1 -BackupFile backups\nexus_YYYYMMDD_HHMMSS.db
```

Linux:

```sh
sh scripts/restore.sh backups/nexus_YYYYMMDD_HHMMSS.db
```

## Segredos

Arquivos reais `.env`, `.env.local`, `.env.vps` e diretorios `secrets/` e `config/secrets/` ficam fora do Git.

## Validacao executada

```text
docker compose --env-file .env.local.example -f docker-compose.local.yml config
docker compose --env-file .env.vps.example -f docker-compose.vps.yml config
POWERSHELL_SYNTAX_OK
Varredura de paths rigidos nos novos artefatos: OK
```
