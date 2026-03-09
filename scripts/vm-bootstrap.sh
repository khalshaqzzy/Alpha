#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — VM Bootstrap Script
# Run this ONCE on a fresh Ubuntu 24.04 VM to install all prerequisites.
# Usage:  sudo bash scripts/vm-bootstrap.sh
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

# ── Check root ─────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  err "This script must be run as root (use sudo)."
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Alpha — VM Bootstrap"
echo "═══════════════════════════════════════════════════"
echo ""

# ── System updates ─────────────────────────────────────────────────
info "Updating system packages..."
apt update -qq && apt upgrade -y -qq
apt install -y -qq curl git ufw nginx certbot python3-certbot-nginx
log "System packages installed."

# ── Firewall (UFW) ────────────────────────────────────────────────
info "Configuring firewall..."
ufw default deny incoming >/dev/null 2>&1
ufw default allow outgoing >/dev/null 2>&1
ufw allow OpenSSH >/dev/null 2>&1
ufw allow 80/tcp >/dev/null 2>&1
ufw allow 443/tcp >/dev/null 2>&1
echo "y" | ufw enable >/dev/null 2>&1
log "Firewall configured (ports 22, 80, 443)."

# ── Docker ─────────────────────────────────────────────────────────
if command -v docker &>/dev/null; then
  warn "Docker already installed: $(docker --version)"
else
  info "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  log "Docker installed: $(docker --version)"
fi

# Add the calling user to docker group (the user who ran sudo)
REAL_USER="${SUDO_USER:-$USER}"
if ! groups "$REAL_USER" | grep -q docker; then
  usermod -aG docker "$REAL_USER"
  log "Added $REAL_USER to docker group."
fi

# ── Enable Nginx ───────────────────────────────────────────────────
systemctl enable nginx >/dev/null 2>&1
systemctl start nginx >/dev/null 2>&1
log "Nginx enabled and running."

# ── Create app directory ──────────────────────────────────────────
APP_DIR="/opt/alpha"
if [[ ! -d "$APP_DIR" ]]; then
  mkdir -p "$APP_DIR"
  chown "$REAL_USER":"$REAL_USER" "$APP_DIR"
  log "Created $APP_DIR (owned by $REAL_USER)."
else
  warn "$APP_DIR already exists."
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}Bootstrap complete!${NC}"
echo ""
echo "  Next steps:"
echo "  1. Clone the repo:  cd /opt/alpha && git clone <repo> ."
echo "  2. Create .env:     cp .env.example .env && nano .env"
echo "  3. Setup Nginx:     bash scripts/setup-nginx.sh <domain>"
echo "  4. Deploy:          bash scripts/deploy.sh"
echo "═══════════════════════════════════════════════════"
echo ""
