#!/usr/bin/env bash
# usage: scripts/optimise-images.sh path/to/new-photo.png friend-id
set -euo pipefail
magick "$1" -resize 160x160^ -gravity center -extent 160x160 -quality 80 "assets/people/$2.webp"
echo "added assets/people/$2.webp ($(du -h "assets/people/$2.webp" | cut -f1))"
