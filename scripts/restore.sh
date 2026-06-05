#!/bin/bash
set -e
if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file_name>"
  exit 1
fi
cp backups/$1 data/nexus.db
echo "Database restored from backups/$1"
