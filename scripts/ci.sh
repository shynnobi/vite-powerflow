#!/bin/sh
set -e

pnpm format
pnpm lint
pnpm build
pnpm type-check
pnpm test
