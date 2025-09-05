#!/bin/sh
set -e

pnpm format
pnpm lint
pnpm run root-scripts:static
pnpm build
pnpm type-check
pnpm test
