#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE=".env.vps"
if [ ! -f "$ENV_FILE" ]; then
  cp .env.vps.example "$ENV_FILE"
  echo "Criado $ENV_FILE a partir de .env.vps.example. Revise segredos e dominios antes de expor a VPS."
fi

mkdir -p data logs backups config

docker compose --env-file "$ENV_FILE" -f docker-compose.vps.yml up -d --build

PORT="$(grep -E '^FORJA_OS_HOST_PORT=' "$ENV_FILE" | head -n 1 | cut -d= -f2- || true)"
PORT="${PORT:-8080}"
echo "Fabrica iniciada em modo VPS_LINUX."
echo "FORJA OS: porta $PORT"
