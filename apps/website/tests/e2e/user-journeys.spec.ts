// Example E2E test for the website
// This test demonstrates basic user interactions and navigation.
// Feel free to modify or extend these tests based on your specific requirements.

import { expect, test } from '@playwright/test';

test.describe('User journeys', () => {
  test('homepage loads and theme can be toggled', async ({ page }) => {
    // Given: The user arrives on the homepage
    await page.goto('/');

    // Then: The main heading is visible
    await expect(page.getByRole('heading', { name: /Vite PowerFlow/i })).toBeVisible();

    // When: The user toggles the theme
    const themeSwitcher = page.getByTestId('theme-switcher');
    if (await themeSwitcher.isVisible()) {
      await themeSwitcher.click();
      // Optionally, check for a class or attribute change
      // await expect(page.locator('body')).toHaveClass(/dark/);
    }
  });

  test('user can increment, decrement, and reset the counter', async ({ page }) => {
    // Given: The user is on the homepage
    await page.goto('/');

    // When: The user increments the counter twice
    await page.getByTestId('increment-button').click();
    await page.getByTestId('increment-button').click();

    // And: The user decrements the counter once
    await page.getByTestId('decrement-button').click();

    // Then: The counter should show 1
    await expect(page.getByTestId('counter-value')).toHaveText('count is 1');

    // When: The user resets the counter
    await page.getByTestId('reset-button').click();

    // Then: The counter should show 0
    await expect(page.getByTestId('counter-value')).toHaveText('count is 0');
  });
});
