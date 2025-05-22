// Example E2E test for a starter project
// Philosophy: Keep it simple and pedagogical. This test demonstrates navigation and a basic interaction.
// Users are encouraged to delete or extend this file as needed for their own project.

import { expect, test } from '@playwright/test';

test.describe('User journeys', () => {
	test('user navigates through the app and switches theme', async ({ page }) => {
		// Given: The user arrives on the homepage
		await page.goto('/');

		// When: The user navigates to the blog page
		await page.getByRole('link', { name: /Blog/i }).click();
		await expect(page).toHaveURL(/\/blog/);
		await expect(page.getByRole('heading', { name: /Blog/i })).toBeVisible();

		// And: The user navigates to the about page (if it exists)
		if (await page.getByRole('link', { name: /About/i }).isVisible()) {
			await page.getByRole('link', { name: /About/i }).click();
			await expect(page).toHaveURL(/\/about/);
			await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();
		}

		// When: The user toggles the theme
		const themeSwitcher = page.getByTestId('theme-switcher');
		if (await themeSwitcher.isVisible()) {
			await themeSwitcher.click();
			// Optionally, check for a class or attribute change
			// await expect(page.locator('body')).toHaveClass(/dark/);
		}

		// Then: The user can return to the homepage
		await page.getByRole('link', { name: /Home/i }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: /Vite PowerFlow/i })).toBeVisible();
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
