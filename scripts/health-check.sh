#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Alpha — Health Check Script
# Checks the status of all services and reports issues.
# Usage:  bash scripts/health-check.sh [domain]
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; FAILURES=$((FAILURES + 1)); }
info() { echo -e "  ${CYAN}→${NC} $1"; }

APP_DIR="/opt/alpha"
DOMAIN="${1:-}"
FAILURES=0

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Alpha — Health Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Docker containers ─────────────────────────────────────────────
echo "Docker Containers:"
cd "$APP_DIR" 2>/dev/null || { fail "App directory $APP_DIR not found"; }

if docker compose ps --format '{{.Name}} {{.State}}' 2>/dev/null | grep -q "running"; then
  CONTAINERS=$(docker compose ps --format '{{.Name}} {{.State}}' 2>/dev/null)
  while IFS= read -r line; do
    NAME=$(echo "$line" | awk '{print $1}')
    STATE=$(echo "$line" | awk '{print $2}')
    if [[ "$STATE" == "running" ]]; then
      pass "$NAME: running"
    else
      fail "$NAME: $STATE"
    fi
  done <<< "$CONTAINERS"
else
  fail "No running containers found"
fi
echo ""

# ── Backend health (local) ────────────────────────────────────────
echo "Backend API:"
HEALTH=$(curl -sf http://localhost:3000/api/health 2>/dev/null || echo "UNREACHABLE")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  pass "Local health endpoint: OK"
else
  fail "Local health endpoint: $HEALTH"
fi
echo ""

# ── External health (if domain provided) ──────────────────────────
if [[ -n "$DOMAIN" ]]; then
  echo "External Access:"
  EXT_HEALTH=$(curl -sf "https://${DOMAIN}/api/health" 2>/dev/null || echo "UNREACHABLE")
  if echo "$EXT_HEALTH" | grep -q '"status":"ok"'; then
    pass "https://${DOMAIN}/api/health: OK"
  else
    fail "https://${DOMAIN}/api/health: $EXT_HEALTH"
  fi

  # SSL check
  SSL_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  if [[ -n "$SSL_EXPIRY" ]]; then
    pass "SSL certificate expires: $SSL_EXPIRY"
  else
    fail "SSL certificate: could not verify"
  fi
  echo ""
fi

# ── Disk usage ────────────────────────────────────────────────────
echo "Disk Usage:"
DISK_PCT=$(df /opt/alpha --output=pcent 2>/dev/null | tail -1 | tr -d ' %')
if [[ -n "$DISK_PCT" ]]; then
  if [[ "$DISK_PCT" -lt 80 ]]; then
    pass "Disk usage: ${DISK_PCT}%"
  elif [[ "$DISK_PCT" -lt 90 ]]; then
    echo -e "  ${YELLOW}!${NC} Disk usage: ${DISK_PCT}% (warning)"
  else
    fail "Disk usage: ${DISK_PCT}% (critical!)"
  fi
fi

DOCKER_DISK=$(docker system df --format '{{.Size}}' 2>/dev/null | head -1)
if [[ -n "$DOCKER_DISK" ]]; then
  info "Docker images size: $DOCKER_DISK"
fi
echo ""

# ── Memory ────────────────────────────────────────────────────────
echo "Memory:"
MEM_TOTAL=$(free -m | awk '/^Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/^Mem:/ {print $3}')
MEM_PCT=$((MEM_USED * 100 / MEM_TOTAL))
if [[ "$MEM_PCT" -lt 85 ]]; then
  pass "Memory: ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_PCT}%)"
else
  fail "Memory: ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_PCT}% — high!)"
fi
echo ""

# ── Summary ───────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════"
if [[ "$FAILURES" -eq 0 ]]; then
  echo -e "  ${GREEN}All checks passed!${NC}"
else
  echo -e "  ${RED}${FAILURES} check(s) failed.${NC}"
fi
echo "═══════════════════════════════════════════════════"
echo ""

exit "$FAILURES"
