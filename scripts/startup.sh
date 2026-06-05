#!/bin/bash
set -e
echo "Starting Operational Core..."
docker-compose up -d --build
echo "Operational Core is running."
