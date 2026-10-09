#!/bin/bash
cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Starting Docker Desktop..."
    open -a Docker
    while ! docker info >/dev/null 2>&1; do
        sleep 2
    done
fi

echo "Starting TIET Exam-Prep Platform..."
docker compose up -d

# Wait until app is ready
echo "Waiting for app to launch..."
sleep 3

# Open default browser
open "http://localhost:3000"

echo "Platform is running at http://localhost:3000"
