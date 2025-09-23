#!/bin/sh

# setup-e2e.sh — Install Playwright browsers for E2E testing
echo "🎭 Setting up Playwright browsers for E2E testing..."

# Detect environment
if [ -f /.dockerenv ] || [ "$CONTAINER" = "true" ]; then
  echo "🐳 Running in container environment"
  ENV_TYPE="container"
else
  echo "💻 Running in local environment"
  ENV_TYPE="local"
fi

# Check if browsers are already installed by testing if they can actually run
if pnpm exec playwright install --dry-run > /dev/null 2>&1; then
  # Get the first browser location from dry-run output
  FIRST_BROWSER_PATH=$(pnpm exec playwright install --dry-run 2>&1 | grep "Install location:" | head -1 | sed 's/.*Install location:[[:space:]]*//')

  # Check if the browser directory actually exists and has content
  if [ -d "$FIRST_BROWSER_PATH" ] && [ "$(ls -A "$FIRST_BROWSER_PATH" 2>/dev/null)" ]; then
    echo "✅ Playwright browsers are already installed"
    echo "📍 Location: $FIRST_BROWSER_PATH"
    exit 0
  else
    echo "⚠️  Browser cache directory exists but is empty, reinstalling..."
  fi
fi

echo "📦 Installing Playwright browsers (this may take a few minutes)..."
echo "   This will install browsers in the appropriate cache directory for your environment"

# Install with appropriate flags
if [ "$ENV_TYPE" = "container" ]; then
  echo "   Container mode: Installing with system dependencies"
  pnpm exec playwright install --with-deps
else
  echo "   Local mode: Installing browsers only"
  pnpm exec playwright install
fi

if [ $? -eq 0 ]; then
  echo "✅ Playwright browsers installed successfully"
  echo "💡 You can now run: pnpm test:e2e"
  echo "📍 Browsers location: $(pnpm exec playwright install --dry-run 2>&1 | grep -o '/[^[:space:]]*' | head -1 || echo 'Default system cache')"
else
  echo "❌ Failed to install Playwright browsers"
  echo "💡 Try running: pnpm exec playwright install --with-deps"
  exit 1
fi
