#!/bin/sh
set -e

pnpm format
pnpm lint
pnpm run validate:root-scripts
pnpm build
pnpm type-check
pnpm test
