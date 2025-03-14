#!/bin/bash

echo "🔒 Testing Security workflow locally..."

echo "\n🔍 Running security audit..."
pnpm audit --no-audit-level || exit 1

echo "\n✅ All security checks passed!"
