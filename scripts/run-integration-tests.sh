#!/bin/sh
set -e

if [ -n "$(find tests/integration -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
  pnpm exec vitest run tests/integration
else
  echo 'No integration test files found'
fi
