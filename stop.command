#!/bin/bash
cd "$(dirname "$0")"
echo "Stopping TIET Exam-Prep Platform..."
docker compose down
echo "Stopped successfully."
