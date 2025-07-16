#!/bin/sh
set -e

echo "==> updateContentCommand: Detecting architecture and installing dependencies if needed"
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  export SWC_PLATFORM_ARCH=linux-arm64-gnu
  export npm_config_arch=arm64
else
  export SWC_PLATFORM_ARCH=linux-x64-gnu
  export npm_config_arch=x64
fi

if [ ! -d node_modules ] || [ ! -f pnpm-lock.yaml ]; then
  SWC_PLATFORM_ARCH=$SWC_PLATFORM_ARCH npm_config_arch=$npm_config_arch pnpm install
fi

echo "==> updateContentCommand steps done"
