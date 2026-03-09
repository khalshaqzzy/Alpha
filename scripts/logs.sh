#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — View Logs
# Convenience wrapper for Docker Compose logs.
# Usage:  bash scripts/logs.sh [service] [lines]
# Examples:
#   bash scripts/logs.sh              # All services, follow
#   bash scripts/logs.sh backend      # Backend only, follow
#   bash scripts/logs.sh backend 100  # Backend, last 100 lines
#   bash scripts/logs.sh db 50        # Database, last 50 lines
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="/opt/alpha"
cd "$APP_DIR" || { echo "Error: $APP_DIR not found."; exit 1; }

SERVICE="${1:-}"
LINES="${2:-}"

if [[ -n "$SERVICE" && -n "$LINES" ]]; then
  docker compose logs --tail "$LINES" -f "$SERVICE"
elif [[ -n "$SERVICE" ]]; then
  docker compose logs -f "$SERVICE"
else
  docker compose logs -f
fi
