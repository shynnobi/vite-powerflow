#!/bin/sh
set -e
if [ -n "$(find tests/unit tests/integration -name '*.spec.ts' -o -name '*.spec.tsx' -o -name '*.test.ts' -o -name '*.test.tsx' 2>/dev/null)" ]; then
  pnpm exec vitest run
else
    printf "\033[33m⚠️  No unit and integration tests detected.\033[0m\n"
fi
