#!/usr/bin/env bash
# Free ports used by Firebase Emulator Suite (see firebase.json + UI/hub defaults).
set -euo pipefail

PORTS=(8080 9099 9199 4000 4400)

for port in "${PORTS[@]}"; do
  pids=$(lsof -ti ":${port}" 2>/dev/null || true)
  if [ -n "${pids}" ]; then
    echo "Freeing port ${port} (PID(s): ${pids})"
    kill -9 ${pids} 2>/dev/null || true
  fi
done
