#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Docker Cleanup
# Removes unused Docker images, containers, volumes, and build cache.
# Usage:  bash scripts/cleanup.sh
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${CYAN}[→]${NC} $1"; }

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Alpha — Docker Cleanup"
echo "═══════════════════════════════════════════════════"
echo ""

info "Current Docker disk usage:"
docker system df
echo ""

info "Removing stopped containers..."
docker container prune -f

info "Removing unused images..."
docker image prune -af

info "Removing build cache..."
docker builder prune -f

echo ""
info "Docker disk usage after cleanup:"
docker system df

echo ""
log "Cleanup complete!"
echo ""
