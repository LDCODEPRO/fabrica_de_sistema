#!/bin/bash
set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
cp data/nexus.db backups/nexus_$TIMESTAMP.db
echo "Backup saved: backups/nexus_$TIMESTAMP.db"
