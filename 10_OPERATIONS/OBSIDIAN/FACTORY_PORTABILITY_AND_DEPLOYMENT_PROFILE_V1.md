# FACTORY_PORTABILITY_AND_DEPLOYMENT_PROFILE_V1

Data: 2026-06-05

## Decisao

A Fabrica deve operar com perfis portaveis, sem depender de letra de unidade, caminho fixo do Windows ou maquina atual.

## Perfis

- LOCAL_WINDOWS
- PORTABLE_USB
- VPS_LINUX

## Artefatos

- `.env.example`
- `.env.local.example`
- `.env.vps.example`
- `docker-compose.local.yml`
- `docker-compose.vps.yml`
- `scripts/start_local.ps1`
- `scripts/stop_local.ps1`
- `scripts/start_vps.sh`
- `scripts/stop_vps.sh`
- `scripts/backup.ps1`
- `scripts/backup.sh`
- `scripts/restore.ps1`
- `scripts/restore.sh`

## Evidencia

```text
LOCAL compose config: OK
VPS compose config: OK
POWERSHELL_SYNTAX_OK
Paths rigidos nos novos artefatos: nenhum encontrado
```

## Limitacao de execucao

Docker daemon indisponivel na sessao atual, portanto o runtime de containers nao foi iniciado aqui.

## Status

```text
FACTORY PORTABLE ........ OK
LOCAL MODE .............. CONFIG_OK
USB MODE ................ OK
VPS READY ............... CONFIG_OK
```
