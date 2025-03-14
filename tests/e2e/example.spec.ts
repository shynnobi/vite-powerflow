import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Vite/);
});

test('homepage has expected content', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: /Vite \+ React/ })).toBeVisible();
});
