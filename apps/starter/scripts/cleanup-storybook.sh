#!/bin/bash

# Storybook/Nx process cleanup script (native version)
echo "🧹 Cleaning up Storybook/Nx processes..."

# Stop Nx daemon (native option)
echo "🔄 Stopping Nx daemon..."
pnpm nx daemon --stop > /dev/null 2>&1 || true

# Reset Nx (native option)
echo "🔄 Resetting Nx cache..."
pnpm nx reset > /dev/null 2>&1 || true

# Cleanup remaining processes (fallback)
echo "🔪 Cleaning up remaining processes..."
pkill -f "nx storybook" 2>/dev/null || true
pkill -f "pnpm storybook" 2>/dev/null || true
pkill -f "storybook" 2>/dev/null || true

echo "✅ Cleanup completed!"
