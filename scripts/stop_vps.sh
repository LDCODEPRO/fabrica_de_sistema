#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE=".env.vps"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE=".env.example"
fi

docker compose --env-file "$ENV_FILE" -f docker-compose.vps.yml down
echo "Fabrica VPS parada."
