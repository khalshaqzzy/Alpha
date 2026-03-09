#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Nginx + SSL Setup Script
# Sets up Nginx reverse proxy and obtains SSL certificate.
# Usage:  sudo bash scripts/setup-nginx.sh <domain> [email]
# Example: sudo bash scripts/setup-nginx.sh prod.cryptoalpha.site admin@cryptoalpha.site
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
  err "Usage: sudo bash scripts/setup-nginx.sh <domain> [email]"
fi

if [[ $EUID -ne 0 ]]; then
  err "This script must be run as root (use sudo)."
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Nginx + SSL Setup for: $DOMAIN"
echo "═══════════════════════════════════════════════════"
echo ""

NGINX_CONF="/etc/nginx/sites-available/alpha"

# ── Write Nginx config ────────────────────────────────────────────
info "Writing Nginx config..."
cat > "$NGINX_CONF" <<EOF
# WebSocket upgrade map — required for Socket.IO / SSE
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name ${DOMAIN};

    # Max upload size
    client_max_body_size 10M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket / Socket.IO support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_cache_bypass \$http_upgrade;

        # Forward real client info
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts for long-running AI requests & SSE streams
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 10s;

        # SSE: disable buffering so events stream immediately
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
    }
}
EOF
log "Nginx config written to $NGINX_CONF"

# ── Enable site ───────────────────────────────────────────────────
if [[ ! -L /etc/nginx/sites-enabled/alpha ]]; then
  ln -s "$NGINX_CONF" /etc/nginx/sites-enabled/alpha
fi
rm -f /etc/nginx/sites-enabled/default
log "Site enabled, default site removed."

# ── Test and reload ───────────────────────────────────────────────
info "Testing Nginx config..."
nginx -t
systemctl reload nginx
log "Nginx reloaded."

# ── SSL via Certbot ───────────────────────────────────────────────
info "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect

log "SSL certificate obtained and HTTP→HTTPS redirect enabled."

# ── Verify auto-renewal ──────────────────────────────────────────
info "Testing certificate auto-renewal..."
certbot renew --dry-run
log "Auto-renewal is working."

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "  ${GREEN}Nginx + SSL setup complete!${NC}"
echo "  https://${DOMAIN}/api/health"
echo "═══════════════════════════════════════════════════"
echo ""
