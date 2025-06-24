#!/bin/sh

# Playwright cache directory (persistent volume recommended)
PLAYWRIGHT_CACHE_DIR="$HOME/.cache/ms-playwright"
export PLAYWRIGHT_BROWSERS_PATH="$PLAYWRIGHT_CACHE_DIR"

# Create the cache directory if it does not exist
if [ ! -d "$PLAYWRIGHT_CACHE_DIR" ]; then
    mkdir -p "$PLAYWRIGHT_CACHE_DIR"
fi

# Fix permissions if needed (useful in container environments)
if [ -n "$USER" ]; then
    chown -R "$USER":"$USER" "$PLAYWRIGHT_CACHE_DIR" 2>/dev/null || true
fi

# Install Playwright browsers if the cache directory is empty
if [ -z "$(ls -A "$PLAYWRIGHT_CACHE_DIR" 2>/dev/null)" ]; then
    echo "Installing Playwright browsers in $PLAYWRIGHT_CACHE_DIR..."
    pnpm exec playwright install --with-deps || {
        echo "Playwright install failed" >&2
        exit 1
    }
fi

# Run E2E tests if test files are present
if [ -n "$(find tests/e2e -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
    pnpm exec playwright test --reporter=dot "$@"
else
    echo "No E2E test files found"
fi
