#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Database Restore Script
# Restores a PostgreSQL dump from a backup file.
# Usage:  bash scripts/restore-db.sh <backup_file>
# Example: bash scripts/restore-db.sh /opt/alpha/backups/alpha_20260303_120000.sql.gz
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info() { echo -e "${CYAN}[→]${NC} $1"; }

BACKUP_FILE="${1:-}"
APP_DIR="/opt/alpha"

if [[ -z "$BACKUP_FILE" ]]; then
  err "Usage: bash scripts/restore-db.sh <backup_file.sql.gz>"
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  err "Backup file not found: $BACKUP_FILE"
fi

cd "$APP_DIR" || err "Directory $APP_DIR not found."

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${YELLOW}⚠  DATABASE RESTORE${NC}"
echo "  File: $BACKUP_FILE"
echo "═══════════════════════════════════════════════════"
echo ""
warn "This will DROP and recreate the alpha database."
read -rp "Are you sure? (type YES to confirm): " CONFIRM

if [[ "$CONFIRM" != "YES" ]]; then
  echo "Aborted."
  exit 0
fi

# ── Stop backend to prevent connections ───────────────────────────
info "Stopping backend..."
docker compose stop backend

# ── Drop and recreate database ────────────────────────────────────
info "Dropping and recreating database..."
docker compose exec -T db psql -U alpha -d postgres -c "DROP DATABASE IF EXISTS alpha;"
docker compose exec -T db psql -U alpha -d postgres -c "CREATE DATABASE alpha;"

# ── Restore ───────────────────────────────────────────────────────
info "Restoring from backup..."
gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U alpha -d alpha

log "Database restored."

# ── Restart backend ───────────────────────────────────────────────
info "Starting backend..."
docker compose start backend

# Wait for health
sleep 3
HEALTH=$(curl -sf http://localhost:3000/api/health 2>/dev/null || echo "STARTING")
log "Backend status: $HEALTH"

echo ""
log "Restore complete!"
echo ""
