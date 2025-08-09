#!/usr/bin/env node
import { execSync } from 'child_process';
import console from 'console';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { globSync } from 'glob';
import { homedir } from 'os';
import path from 'path';
import process from 'process';

// Playwright cache directory (persistent volume recommended)
const PLAYWRIGHT_CACHE_DIR = path.join(homedir(), '.cache', 'ms-playwright');
process.env.PLAYWRIGHT_BROWSERS_PATH = PLAYWRIGHT_CACHE_DIR;

// Create the cache directory if it does not exist
if (!existsSync(PLAYWRIGHT_CACHE_DIR)) {
  mkdirSync(PLAYWRIGHT_CACHE_DIR, { recursive: true });
}

// Fix permissions if needed (useful in container environments)
try {
  const user = process.env.USER;
  if (user) {
    execSync(`chown -R ${user}:${user} "${PLAYWRIGHT_CACHE_DIR}"`, { stdio: 'ignore' });
  }
} catch {
  // Ignore errors (e.g., not running as root)
}

// Install Playwright browsers if the cache directory is empty
try {
  const files = readdirSync(PLAYWRIGHT_CACHE_DIR);
  if (!files || files.length === 0) {
    console.log(`Installing Playwright browsers in ${PLAYWRIGHT_CACHE_DIR}...`);
    execSync('pnpm exec playwright install --with-deps', { stdio: 'inherit' });
  }
} catch {
  console.error('Playwright install failed');
  process.exit(1);
}

// Run E2E tests if test files are present
const testFiles = globSync('tests/e2e/*.{spec,test}.ts');
if (testFiles.length > 0) {
  execSync('pnpm exec playwright test --reporter=dot', { stdio: 'inherit' });
} else {
  // Print warning in yellow if no E2E tests are found
  console.log('\x1b[33m⚠️  No end-to-end tests detected.\x1b[0m');
}
