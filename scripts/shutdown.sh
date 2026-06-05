#!/bin/bash
set -e
echo "Stopping Operational Core..."
docker-compose down
echo "Operational Core stopped."
