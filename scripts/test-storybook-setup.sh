#!/bin/bash
echo "Testing on-demand installation of Storybook"
echo ""
echo "1. Checking if Playwright is already installed..."
if [ -d "/home/node/.cache/ms-playwright" ]; then
  echo "   ⚠️  Playwright is already installed, removing to simulate a new container..."
  rm -rf /home/node/.cache/ms-playwright
fi

echo ""
echo "2. Running installation command..."
echo "   This may take a few minutes..."
time pnpm storybook:setup

echo ""
echo "3. Checking result..."
if [ -d "/home/node/.cache/ms-playwright" ]; then
  echo "   ✅ Installation successful!"
else
  echo "   ❌ Installation failed."
fi

echo ""
echo "To launch Storybook, run: pnpm storybook:dev"
echo "For everything (installation + launch), run: pnpm storybook"
