#!/usr/bin/env tsx
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { globSync } from 'glob';
import { homedir } from 'os';
import path from 'path';
import process from 'process';

import { logInfo, logSuccess, logError } from '../src/utils/shared/logger.ts';

// Playwright cache directory (persistent volume recommended)
const PLAYWRIGHT_CACHE_DIR = path.join(homedir(), '.cache', 'ms-playwright');
process.env.PLAYWRIGHT_BROWSERS_PATH = PLAYWRIGHT_CACHE_DIR;

// Create the cache directory if it does not exist
if (!existsSync(PLAYWRIGHT_CACHE_DIR)) {
  mkdirSync(PLAYWRIGHT_CACHE_DIR, { recursive: true });
}

// Fix permissions if needed (useful in container environments)
const isContainer =
  process.env.CONTAINER === 'true' ||
  existsSync('/.dockerenv') ||
  process.env.KUBERNETES_SERVICE_HOST;
if (isContainer) {
  try {
    const user = process.env.USER;
    if (user) {
      execSync(`chown -R ${user}:${user} "${PLAYWRIGHT_CACHE_DIR}"`, { stdio: 'ignore' });
    }
  } catch {
    // Ignore errors
  }
}

// Check if browsers are already installed
const checkBrowsersInstalled = () => {
  try {
    // Check if the main browser directories exist
    const browsers = ['chromium', 'firefox', 'webkit'];
    const browserDirs = browsers.map(
      browser => globSync(`${PLAYWRIGHT_CACHE_DIR}/${browser}-*`).length > 0
    );
    return browserDirs.every(exists => exists);
  } catch {
    return false;
  }
};

// Install Playwright browsers if needed
const browsersInstalled = checkBrowsersInstalled();
if (!browsersInstalled) {
  logInfo('Installing Playwright browsers...');
  try {
    // Show the installation process for visual feedback
    execSync('pnpm exec playwright install --with-deps', { stdio: 'inherit' });
    logSuccess('Playwright browsers installed successfully.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError(`Playwright install failed: ${errorMessage}`);
    process.exit(1);
  }
} else {
  logInfo('Playwright browsers are already installed.');
}

// Build the application before running tests
logInfo('Building application...');
try {
  execSync('pnpm build', { stdio: 'inherit' });
  logSuccess('Build completed');
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logError(`Application build failed: ${errorMessage}`);
  process.exit(1);
}

// Run E2E tests
const testFiles = globSync('tests/e2e/*.{spec,test}.ts');
if (testFiles.length > 0) {
  const startTime = Date.now();
  try {
    execSync('pnpm exec playwright test', { stdio: 'inherit' });
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    logSuccess(`E2E tests completed (${testFiles.length} files, ${duration}s)`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError(`E2E tests failed: ${errorMessage}`);
    process.exit(1);
  }
} else {
  logInfo('No end-to-end tests detected.');
}
