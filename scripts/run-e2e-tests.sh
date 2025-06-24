#!/bin/sh

# Check if Playwright browsers are installed (cache folder exists and is not empty)
if [ ! -d "$HOME/.cache/ms-playwright" ] || [ -z "$(ls -A $HOME/.cache/ms-playwright 2>/dev/null)" ]; then
    echo "Installing Playwright browsers..."
    sudo chown -R node:node $HOME/.cache
    pnpm exec playwright install --with-deps
fi

# Run the E2E tests if test files exist
if [ -n "$(find tests/e2e -name '*.spec.ts' -o -name '*.test.ts' 2>/dev/null)" ]; then
    pnpm exec playwright test --reporter=dot "$@"
else
    echo "No E2E test files found"
fi
