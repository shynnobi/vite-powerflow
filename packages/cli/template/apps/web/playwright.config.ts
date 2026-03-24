import { defineConfig, devices } from '@playwright/test';

const chromiumProject = {
  name: 'chromium',
  use: {
    ...devices['Desktop Chrome'],
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
};

const ciProjects = [
  chromiumProject,
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
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      },
    },
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
  },
];

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
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
    : [['dot'], ['html', { open: 'never' }]],
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
  projects: process.env.CI ? ciProjects : [chromiumProject],
  webServer: {
    command: 'pnpm build && pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes timeout for build + server start
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
