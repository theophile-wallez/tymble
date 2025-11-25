#!/usr/bin/env bash
set -euo pipefail

HOSTNAMES=("api.local.tymble.xyz" "app.local.tymble.xyz")
IP="127.0.0.1"
HOSTS_FILE="/etc/hosts"

if [ "${EUID:-$(id -u)}" -ne 0 ]; then
  SUDO="sudo"
else
  SUDO=""
fi

missing=()
for HOSTNAME in "${HOSTNAMES[@]}"; do
  if ! grep -qE "^[^#]*\s${HOSTNAME}(\s|$)" "$HOSTS_FILE"; then
    missing+=("$HOSTNAME")
  fi
done

if [ ${#missing[@]} -eq 0 ]; then
  echo "All entries already present in $HOSTS_FILE: ${HOSTNAMES[*]}"
  exit 0
fi

# Backup hosts file with timestamp
BACKUP_PATH="${HOSTS_FILE}.bak.$(date +%Y%m%d%H%M%S)"
$SUDO cp "$HOSTS_FILE" "$BACKUP_PATH"
echo "Backup created: $BACKUP_PATH"

for HOSTNAME in "${missing[@]}"; do
  ENTRY="${IP} ${HOSTNAME}"
  echo "Adding: $ENTRY"
  # Append safely with elevated permissions if needed
  printf "%s\n" "$ENTRY" | $SUDO tee -a "$HOSTS_FILE" >/dev/null
done

echo "Done. You can test with:"
echo "  curl -s http://api.local.tymble.xyz:3000 || true"
echo "  curl -s http://app.local.tymble.xyz || true"