#!/bin/bash
# Publish a new resume.
#
# A static site can't look inside a folder and pick a file — the page has to
# link to one fixed path. So the site always links to assets/resume.pdf, and
# this script installs whatever resume PDF you dropped in as that file.
#
#   1. Drop your new PDF in assets/ (any name containing "resume")
#   2. Run:  ./update-resume.sh
#
# The old copy is kept in assets/_originals/.

set -euo pipefail
cd "$(dirname "$0")"

TARGET="assets/resume.pdf"

# newest *resume*.pdf in assets/, ignoring the published one
NEW=$(find assets -maxdepth 1 -type f -iname "*resume*.pdf" ! -name "resume.pdf" \
      -exec stat -f "%m %N" {} + 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)

if [ -z "$NEW" ]; then
  if [ -f "$TARGET" ]; then
    echo "No new resume PDF found in assets/."
    echo "Currently published: $TARGET ($(du -h "$TARGET" | cut -f1), updated $(date -r "$TARGET" '+%d %b %Y'))"
    echo "To update: drop a PDF with \"resume\" in its name into assets/, then run this again."
  else
    echo "No resume PDF found in assets/ — nothing is published yet."
  fi
  exit 0
fi

mkdir -p assets/_originals
[ -f "$TARGET" ] && cp "$TARGET" "assets/_originals/resume-replaced-$(date +%Y%m%d-%H%M%S).pdf"

cp "$NEW" "$TARGET"
mv "$NEW" assets/_originals/

echo "Published: $NEW  ->  $TARGET"
echo "Now commit it:  git add $TARGET && git commit -m 'Update resume'"
