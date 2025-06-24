#!/bin/sh
set -e
if [ -n "$(find tests/unit -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
  pnpm exec vitest run tests/unit
else
  echo 'No unit test files found'
fi
