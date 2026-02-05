#!/bin/sh
set -e

echo "==> onCreateCommand: Detecting architecture and installing dependencies"
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  export SWC_PLATFORM_ARCH=linux-arm64-gnu
  export npm_config_arch=arm64
else
  export SWC_PLATFORM_ARCH=linux-x64-gnu
  export npm_config_arch=x64
fi

echo "Detected architecture: $ARCH, SWC_PLATFORM_ARCH=$SWC_PLATFORM_ARCH"
sudo apt-get update
sudo apt-get install -y build-essential python3 curl
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
if [ ! -d node_modules ]; then
  SWC_PLATFORM_ARCH=$SWC_PLATFORM_ARCH npm_config_arch=$npm_config_arch pnpm install
fi

echo "==> onCreateCommand steps done"
