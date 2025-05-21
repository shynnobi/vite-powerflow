#!/bin/sh
set -e
if [ -n "$(find tests/e2e -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
  if [ ! -f /home/node/.cache/ms-playwright/chromium-*/chrome-linux/chrome ]; then
    pnpm exec playwright install --with-deps chromium
  fi
  pnpm exec playwright test "$@"
else
  echo 'No E2E test files found'
fi
