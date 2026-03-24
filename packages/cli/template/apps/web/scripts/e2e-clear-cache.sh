#!/bin/sh

# clear-e2e-cache.sh — Clear Playwright browsers cache
echo "🧹 Clearing Playwright browsers cache..."

# Detect environment
if [ -f /.dockerenv ] || [ "$CONTAINER" = "true" ]; then
  echo "🐳 Running in container environment"
  ENV_TYPE="container"
else
  echo "💻 Running in local environment"
  ENV_TYPE="local"
fi

# Set cache directory based on environment
if [ "$ENV_TYPE" = "container" ]; then
  CACHE_DIR="/home/node/.cache/ms-playwright"
else
  CACHE_DIR="$HOME/.cache/ms-playwright"
fi

echo "📍 Cache directory: $CACHE_DIR"

# Check if cache directory exists
if [ -d "$CACHE_DIR" ]; then
  echo "🗑️  Removing cache directory..."
  rm -rf "$CACHE_DIR"
  echo "✅ Cache directory removed successfully"
else
  echo "ℹ️  Cache directory does not exist (nothing to clear)"
fi

# Also clear Nx cache for e2e tests
echo "🧹 Clearing Nx cache for e2e tests..."
pnpm nx reset --target=test:e2e 2>/dev/null || echo "ℹ️  Nx cache already clear"

echo "🎯 Cache clearing completed!"
echo "💡 Run 'pnpm test:e2e:setup' to reinstall browsers"
