#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Database Backup Script
# Creates a timestamped PostgreSQL dump.
# Usage:  bash scripts/backup-db.sh [backup_dir]
# Default backup dir: /opt/alpha/backups
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

APP_DIR="/opt/alpha"
BACKUP_DIR="${1:-$APP_DIR/backups}"
TIMESTAMP=$(date "+%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/alpha_${TIMESTAMP}.sql.gz"
KEEP_DAYS=7

cd "$APP_DIR" || err "Directory $APP_DIR not found."

echo ""
info "Backing up Alpha database..."

# ── Create backup dir ─────────────────────────────────────────────
mkdir -p "$BACKUP_DIR"

# ── Dump and compress ─────────────────────────────────────────────
docker compose exec -T db pg_dump -U alpha alpha | gzip > "$BACKUP_FILE"

if [[ -f "$BACKUP_FILE" ]]; then
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  log "Backup created: $BACKUP_FILE ($SIZE)"
else
  err "Backup failed!"
fi

# ── Prune old backups ─────────────────────────────────────────────
DELETED=$(find "$BACKUP_DIR" -name "alpha_*.sql.gz" -mtime +"$KEEP_DAYS" -delete -print | wc -l)
if [[ "$DELETED" -gt 0 ]]; then
  log "Pruned $DELETED backup(s) older than ${KEEP_DAYS} days."
fi

echo ""
