#!/bin/bash

echo "🚀 Testing CI workflow locally..."

echo "\n📝 Running Lint checks..."
pnpm lint || exit 1

echo "\n✨ Checking formatting..."
pnpm prettier --check . || exit 1

echo "\n🔍 Running Type check..."
pnpm type-check || exit 1

echo "\n📦 Building project..."
pnpm build || exit 1

echo "\n✅ All CI checks passed!"
