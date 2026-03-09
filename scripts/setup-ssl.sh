#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — SSL Certificate Setup (Standalone)
# Obtains or renews an SSL certificate via Certbot.
# Use this if setup-nginx.sh already ran but SSL step failed,
# or to manually trigger certificate renewal.
# Usage:  sudo bash scripts/setup-ssl.sh <domain> [email]
# Example: sudo bash scripts/setup-ssl.sh prod.cryptoalpha.site admin@cryptoalpha.site
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

DOMAIN="${1:-}"
EMAIL="${2:-admin@cryptoalpha.site}"

if [[ -z "$DOMAIN" ]]; then
  err "Usage: sudo bash scripts/setup-ssl.sh <domain> [email]"
fi

if [[ $EUID -ne 0 ]]; then
  err "This script must be run as root (use sudo)."
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  SSL Certificate Setup for: $DOMAIN"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Check prerequisites ──────────────────────────────────────────
if ! command -v certbot &>/dev/null; then
  err "Certbot not found. Run: sudo apt install certbot python3-certbot-nginx"
fi

if ! command -v nginx &>/dev/null; then
  err "Nginx not found. Run: sudo apt install nginx"
fi

# ── Check Nginx is running ───────────────────────────────────────
if ! systemctl is-active --quiet nginx; then
  info "Starting Nginx..."
  systemctl start nginx
fi

# ── Check DNS resolution ─────────────────────────────────────────
info "Checking DNS for $DOMAIN..."
RESOLVED_IP=$(dig +short "$DOMAIN" 2>/dev/null || echo "")
if [[ -z "$RESOLVED_IP" ]]; then
  warn "Could not resolve $DOMAIN. Make sure DNS A record is configured."
  warn "Proceeding anyway — Certbot will fail if DNS is not set up."
else
  log "DNS resolves to: $RESOLVED_IP"
fi

# ── Obtain certificate ───────────────────────────────────────────
info "Requesting SSL certificate..."
certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect

log "SSL certificate obtained."

# ── Verify ────────────────────────────────────────────────────────
info "Verifying certificate..."
EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "unknown")
log "Certificate expires: $EXPIRY"

# ── Test auto-renewal ────────────────────────────────────────────
info "Testing auto-renewal..."
certbot renew --dry-run
log "Auto-renewal is working."

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}SSL setup complete!${NC}"
echo "  https://${DOMAIN}"
echo "  Expires: $EXPIRY"
echo "═══════════════════════════════════════════════════"
echo ""
