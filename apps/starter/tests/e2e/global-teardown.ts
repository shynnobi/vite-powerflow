import { chromium } from '@playwright/test';

async function globalTeardown() {
  console.log('🧹 Global teardown: Cleaning up browser processes...');

  // Force cleanup of any remaining browser processes
  try {
    const browser = await chromium.launch();
    await browser.close();
  } catch {
    // Ignore errors during teardown
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
