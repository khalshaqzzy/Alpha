#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Deploy Script
# Pulls latest code, rebuilds Docker, runs migrations.
# Usage:  bash scripts/deploy.sh [branch]
# Default branch: auto-detects current branch
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

# Allow git operations even if the directory is owned by a different user
# (needed when GitHub Actions SSHes in as a different user than the repo owner)
git config --global --add safe.directory "$APP_DIR"

cd "$APP_DIR" || err "Directory $APP_DIR not found."

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Alpha — Deploying branch: $BRANCH"
echo "  Time: $TIMESTAMP"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Pull latest ───────────────────────────────────────────────────
info "Pulling latest from origin/$BRANCH..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
COMMIT=$(git rev-parse --short HEAD)
log "Checked out $BRANCH @ $COMMIT"

# ── Build and restart ─────────────────────────────────────────────
info "Stopping containers..."
docker compose down

info "Building images (no cache)..."
docker compose build --no-cache

info "Starting containers..."
docker compose up -d

# ── Wait for backend to be healthy ────────────────────────────────
info "Waiting for backend to start..."
RETRIES=0
MAX_RETRIES=30
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  RETRIES=$((RETRIES + 1))
  if [[ $RETRIES -ge $MAX_RETRIES ]]; then
    err "Backend failed to start after ${MAX_RETRIES}s. Check logs: docker compose logs backend"
  fi
  sleep 1
done
log "Backend is healthy."

# ── Run migrations ────────────────────────────────────────────────
info "Running database migrations..."
docker compose exec -T backend npx prisma migrate deploy
log "Migrations applied."

# ── Done ──────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}Deploy complete!${NC}"
echo "  Branch:  $BRANCH"
echo "  Commit:  $COMMIT"
echo "  Health:  $(curl -s http://localhost:3000/api/health)"
echo "═══════════════════════════════════════════════════"
echo ""
