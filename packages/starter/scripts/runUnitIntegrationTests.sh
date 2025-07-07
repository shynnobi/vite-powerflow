#!/bin/sh
set -e
if find . -type f \( -name '*.spec.ts' -o -name '*.spec.tsx' -o -name '*.test.ts' -o -name '*.test.tsx' \) | grep -q .; then
  pnpm exec vitest run
else
  printf "\033[33m⚠️  No unit or integration tests detected.\033[0m\n"
fi
