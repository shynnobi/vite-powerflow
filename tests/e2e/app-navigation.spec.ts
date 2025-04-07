import { expect, test } from '@playwright/test';

test.describe('Basic Site Navigation', () => {
	test('should load the homepage correctly', async ({ page }) => {
		// Navigate to the homepage
		await page.goto('/');

		// Check if the title is correct
		await expect(page).toHaveTitle(/Vite \+ React/);

		// Check if main heading is visible
		const heading = page.getByRole('heading', { name: 'Vite + React' });
		await expect(heading).toBeVisible();
	});
});
