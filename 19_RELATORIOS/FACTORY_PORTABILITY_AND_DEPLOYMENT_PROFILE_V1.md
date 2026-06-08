# FACTORY_PORTABILITY_AND_DEPLOYMENT_PROFILE_V1

Data: 2026-06-05

## Objetivo

Preparar a Fabrica de Sistemas e a FORJA OS para operar com a mesma estrutura base em:

- LOCAL_WINDOWS
- PORTABLE_USB
- VPS_LINUX

## Artefatos criados

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

## Decisoes de portabilidade

- O novo perfil nao usa caminhos fixos de unidade do Windows nem caminhos absolutos de usuario Linux.
- Os scripts calculam a raiz da Fabrica a partir do proprio diretorio `scripts`.
- Dados, logs, backups e configuracoes sao definidos por variaveis:
  - `FACTORY_DATA_DIR`
  - `FACTORY_LOG_DIR`
  - `FACTORY_BACKUP_DIR`
  - `FACTORY_CONFIG_DIR`
  - `FACTORY_DATABASE_FILE`
- Segredos reais ficam fora do Git por `.gitignore`.
- Os exemplos trazem placeholders `CHANGE_ME`, nunca segredos reais.
- O banco padrao em container usa `sqlite:////app/data/nexus.db`, com persistencia controlada pelo host via `FACTORY_DATA_DIR`.

## Perfis

### LOCAL_WINDOWS

Arquivo:

```text
.env.local.example
docker-compose.local.yml
scripts/start_local.ps1
scripts/stop_local.ps1
```

Uso esperado:

```text
.\scripts\start_local.ps1
.\scripts\stop_local.ps1
```

### PORTABLE_USB

Usa o mesmo perfil local com diretórios relativos:

```text
FACTORY_DATA_DIR=./data
FACTORY_LOG_DIR=./logs
FACTORY_BACKUP_DIR=./backups
FACTORY_CONFIG_DIR=./config
```

Ao copiar a pasta da Fabrica para outro disco ou pendrive, os dados continuam relativos a raiz copiada.

### VPS_LINUX

Arquivo:

```text
.env.vps.example
docker-compose.vps.yml
scripts/start_vps.sh
scripts/stop_vps.sh
```

Uso esperado em servidor Linux:

```text
sh scripts/start_vps.sh
sh scripts/stop_vps.sh
```

## Validacao executada

### Docker Compose

Executado:

```text
docker compose --env-file .env.local.example -f docker-compose.local.yml config
docker compose --env-file .env.vps.example -f docker-compose.vps.yml config
```

Resultado:

```text
LOCAL compose config: OK
VPS compose config: OK
```

Observacao: o Docker mostra caminhos absolutos na saida de `config` porque expande caminhos relativos conforme a pasta atual. Os arquivos fonte criados continuam sem caminhos rigidos.

### Scripts PowerShell

Executado parser de sintaxe:

```text
POWERSHELL_SYNTAX_OK
```

### Varredura de caminhos rigidos nos novos artefatos

Termos auditados: letras de unidade Windows, caminhos absolutos comuns de usuario Linux e caminhos absolutos comuns de macOS.

Resultado:

```text
Nenhum caminho rigido encontrado nos novos artefatos.
```

## Limitacoes reais do ambiente atual

- Docker daemon indisponivel nesta sessao:

```text
failed to connect to the docker API at npipe:////./pipe/docker_engine
```

- `bash` nao esta instalado no Windows desta sessao, entao os scripts `.sh` nao foram executados localmente.
- A execucao direta dos scripts PowerShell foi bloqueada pela politica de sandbox, apesar da validacao de sintaxe ter passado.

## Resultado

```text
FACTORY PORTABLE ........ OK
LOCAL MODE .............. CONFIG_OK
USB MODE ................ OK
VPS READY ............... CONFIG_OK
DOCKER RUNTIME .......... BLOQUEADO_DAEMON_INDISPONIVEL
```

## Pendencia para certificacao runtime completa

Executar em ambiente com Docker daemon ativo:

```text
.\scripts\start_local.ps1
curl http://localhost:8000/health
curl http://localhost:8080/health.json
.\scripts\stop_local.ps1
```

Executar em VPS Linux:

```text
sh scripts/start_vps.sh
curl http://localhost:8000/health
curl http://localhost:8080/health.json
sh scripts/stop_vps.sh
```
