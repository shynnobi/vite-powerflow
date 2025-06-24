# Use the same base image specified in the original devcontainer.json
FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Install system dependencies required for Playwright browsers
# Combine all dependencies found during troubleshooting
RUN sudo apt-get update && sudo apt-get install -y \
    # Initial set from first attempt
    libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    # Second set from second attempt
    libx11-xcb1 libxcursor1 libgtk-3-0 \
    # Third set (likely for WebKit) from third attempt
    libwoff1 libopus0 flite \
    # Fourth set from runtime error
    libharfbuzz-icu0 libenchant-2-2 libsecret-1-0 libhyphen0 libmanette-0.2-0 libunwind8 libdw1 libegl1 libglx0 libgudev-1.0-0 libgles2 \
    # Additional dependencies for Firefox
    libpci3 libgl1-mesa-glx libgl1-mesa-dri \
    # Clean up apt lists to reduce image size
    && sudo rm -rf /var/lib/apt/lists/*

# Create necessary directories with correct permissions
RUN sudo mkdir -p /home/node/.cache/dconf && \
    sudo mkdir -p /home/node/.cache/ms-playwright && \
    sudo chown -R node:node /home/node/.cache

# We can add package installations (like gh CLI) here later if needed
# For now, rely on features in devcontainer.json or manual installation
