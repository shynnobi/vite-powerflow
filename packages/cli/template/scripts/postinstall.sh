#!/bin/sh

# postinstall.sh — Initialize git and configure Husky
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "\033[33m→\033[0m Initializing git repository..."
  git init
fi

git config core.hooksPath .husky
chmod +x .husky/* 2>/dev/null || true

echo "\033[32m[OK]\033[0m Husky hooks are ready"
