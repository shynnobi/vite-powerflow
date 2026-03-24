#!/bin/sh
set -e

pnpm format
pnpm lint
pnpm nx run-many --target=format --all --skip-nx-cache --outputStyle=static
pnpm build
pnpm type-check
pnpm test
