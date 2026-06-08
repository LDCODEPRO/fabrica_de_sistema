#!/usr/bin/env sh
set -eu

if [ $# -lt 1 ]; then
  echo "Uso: ./scripts/restore.sh <arquivo_backup> [arquivo_env]" >&2
  exit 1
fi

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

BACKUP_FILE="$1"
ENV_FILE="${2:-.env.vps}"
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

SOURCE="$BACKUP_FILE"
if [ ! -f "$SOURCE" ]; then
  SOURCE="${BACKUP_DIR}/${BACKUP_FILE}"
fi
if [ ! -f "$SOURCE" ]; then
  echo "Backup nao encontrado: $BACKUP_FILE" >&2
  exit 1
fi

mkdir -p "$DATA_DIR"
TARGET="${DATA_DIR}/${DB_FILE}"
cp "$SOURCE" "$TARGET"

echo "Banco restaurado em: $TARGET"
