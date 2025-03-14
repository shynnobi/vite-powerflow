#!/bin/bash

echo "🔒 Testing Security workflow locally..."

echo "\n🔍 Running security audit..."
pnpm audit --audit-level=moderate || exit 1

echo "\n✅ All security checks passed!"
