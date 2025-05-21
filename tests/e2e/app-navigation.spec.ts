import { expect, test } from '@playwright/test';

test.describe('Basic Site Navigation', () => {
	test('should display the correct title and heading when visiting the homepage', async ({
		page,
	}) => {
		// Given: The user is not on the homepage
		// When: The user navigates to the homepage
		await page.goto('/');

		// Then: The page title should contain "Vite PowerFlow"
		await expect(page).toHaveTitle(/Vite PowerFlow/);

		// And: The main heading should be visible
		const heading = page.getByRole('heading', { name: 'Vite PowerFlow ⚡' });
		await expect(heading).toBeVisible();
	});
});
