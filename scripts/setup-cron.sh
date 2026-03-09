#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Cron Job Setup
# Sets up automated maintenance tasks:
#   - Daily database backup at 02:00
#   - Weekly Docker cleanup on Sunday at 03:00
# Usage:  sudo bash scripts/setup-cron.sh
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
LOG_DIR="/opt/alpha/logs"

if [[ ! -d "$APP_DIR" ]]; then
  err "App directory $APP_DIR not found."
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Alpha — Cron Job Setup"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Create log directory ──────────────────────────────────────────
mkdir -p "$LOG_DIR"
log "Log directory: $LOG_DIR"

# ── Install cron jobs ─────────────────────────────────────────────
CRON_MARKER="# alpha-automated-tasks"

# Remove existing Alpha cron entries (idempotent)
crontab -l 2>/dev/null | grep -v "$CRON_MARKER" | crontab - 2>/dev/null || true

# Add new cron entries
(crontab -l 2>/dev/null || true; cat <<EOF
# ── Alpha Automated Tasks ─────────────────────────── $CRON_MARKER
# Daily database backup at 02:00 AM
0 2 * * * cd $APP_DIR && bash scripts/backup-db.sh >> $LOG_DIR/backup.log 2>&1 $CRON_MARKER
# Weekly Docker cleanup on Sunday at 03:00 AM
0 3 * * 0 cd $APP_DIR && bash scripts/cleanup.sh >> $LOG_DIR/cleanup.log 2>&1 $CRON_MARKER
# Hourly health check (log only, no action)
0 * * * * cd $APP_DIR && bash scripts/health-check.sh >> $LOG_DIR/health.log 2>&1 $CRON_MARKER
EOF
) | crontab -

log "Cron jobs installed."

# ── Display current crontab ───────────────────────────────────────
info "Current crontab:"
echo ""
crontab -l 2>/dev/null | grep "$CRON_MARKER" | while IFS= read -r line; do
  # Skip the header comment
  if [[ "$line" == "# ──"* ]]; then continue; fi
  echo "  $line"
done

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}Cron setup complete!${NC}"
echo ""
echo "  Scheduled tasks:"
echo "  • Daily backup:   02:00 AM  → $LOG_DIR/backup.log"
echo "  • Weekly cleanup: Sun 03:00 → $LOG_DIR/cleanup.log"
echo "  • Hourly health:  :00       → $LOG_DIR/health.log"
echo "═══════════════════════════════════════════════════"
echo ""
