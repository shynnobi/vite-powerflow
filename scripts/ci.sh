#!/bin/sh
set -e

pnpm format
pnpm lint
pnpm nx run-many --target=build --all --exclude=@vite-powerflow/starter-web
pnpm type-check
pnpm test
