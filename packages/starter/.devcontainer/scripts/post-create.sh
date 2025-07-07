#!/bin/sh
set -e

# Make all scripts executable
chmod +x .devcontainer/scripts/*.sh 2>/dev/null || true

echo "==> Configuring husky (if present)"
if [ -d .husky ]; then
  git config core.hooksPath .husky
  chmod +x .husky/* 2>/dev/null || true
fi

echo "==> Authenticating GitHub CLI"
if [ -f .env ] && grep -q '^GH_PAT=' .env; then
  export GH_PAT=$(grep '^GH_PAT=' .env | cut -d '=' -f2-)
  if [ -n "$GH_PAT" ]; then
    echo -n $GH_PAT | gh auth login --with-token
    echo "✅ GitHub CLI authenticated."
  else
    echo "⚠️  GH_PAT is empty in .env. Please add your token."
  fi
else
  echo "⚠️  .env or GH_PAT not found. Please create .env and add your token as GH_PAT=..."
fi

echo "==> Post-create steps done"
