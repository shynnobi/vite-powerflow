#!/bin/sh
set -e
if [ -n "$(find tests/e2e -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
  if ! find /home/node/.cache/ms-playwright -path "*/chromium-*/chrome-linux/chrome" -type f -print -quit | grep -q .; then
    pnpm exec playwright install --with-deps chromium
  fi
  pnpm exec playwright test --reporter=dot "$@"
else
  echo 'No E2E test files found'
fi
