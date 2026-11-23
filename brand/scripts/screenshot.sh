#!/usr/bin/env bash
# Usage: scripts/screenshot.sh examples/index.html out.png [width] [height]
W=${3:-1440}; H=${4:-2200}
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --virtual-time-budget=6000 --window-size=$W,$H --screenshot="$2" "file://$(realpath "$1")" 2>/dev/null
