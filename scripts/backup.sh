#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${1:-.env.vps}"
if [ ! -f "$ENV_FILE" ] && [ -f ".env" ]; then
  ENV_FILE=".env"
fi

get_env() {
  key="$1"
  default="$2"
  if [ -f "$ENV_FILE" ]; then
    value="$(grep -E "^${key}=" "$ENV_FILE" | head -n 1 | cut -d= -f2- || true)"
    if [ -n "$value" ]; then
      printf '%s' "$value" | sed 's/^"//;s/"$//'
      return
    fi
  fi
  printf '%s' "$default"
}

DATA_DIR="$(get_env FACTORY_DATA_DIR ./data)"
BACKUP_DIR="$(get_env FACTORY_BACKUP_DIR ./backups)"
DB_FILE="$(get_env FACTORY_DATABASE_FILE nexus.db)"
DB_PATH="${DATA_DIR}/${DB_FILE}"

if [ ! -f "$DB_PATH" ]; then
  echo "Banco nao encontrado: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date +"%Y%m%d_%H%M%S")"
TARGET="${BACKUP_DIR}/nexus_${STAMP}.db"
cp "$DB_PATH" "$TARGET"

echo "Backup criado: $TARGET"
