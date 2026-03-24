import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Optimized workers: 4 in local for speed, 1 in CI for stability
  workers: process.env.CI ? 1 : 4,
  // Force browser cleanup
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  // Optimized reporters for CI and local
  reporter: process.env.CI
    ? [
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [['html', { open: 'never' }]],
  // Global teardown for cleanup (2025 best practice)
  globalTeardown: './tests/e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:4173',
    // Optimized debug configuration
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    // Timeout for individual actions
    actionTimeout: 10000,
    navigationTimeout: 30000,
    // Optimized configuration to avoid zombie processes
    // (Browser-specific arguments in projects)
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome arguments only for Chromium (simplified per 2025 best practices)
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Chrome arguments only for Mobile Chrome (simplified per 2025 best practices)
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000, // 1 minute timeout
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
