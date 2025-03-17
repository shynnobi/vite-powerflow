import { test, expect } from '@playwright/test';

test.describe('Counter functionality', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the app before each test
		await page.goto('/');
	});

	test('should display initial counter value', async ({ page }) => {
		// Check if the counter is displayed with initial value
		await expect(page.getByText('count is 0')).toBeVisible();
	});

	test('should increment counter when clicking the increment button', async ({ page }) => {
		// Click the increment button
		await page.getByText('count is 0').click();

		// Check if the counter was incremented
		await expect(page.getByText('count is 1')).toBeVisible();
	});

	test('should decrement counter when clicking the decrement button', async ({ page }) => {
		// First increment to 1
		await page.getByText('count is 0').click();

		// Click the decrement button
		await page.getByText('Decrement').click();

		// Check if the counter was decremented back to 0
		await expect(page.getByText('count is 0')).toBeVisible();
	});

	test('should reset counter when clicking the reset button', async ({ page }) => {
		// Increment multiple times
		await page.getByText('count is 0').click();
		await page.getByText('count is 1').click();

		// Verify count is 2
		await expect(page.getByText('count is 2')).toBeVisible();

		// Click the reset button
		await page.getByText('Reset').click();

		// Check if the counter was reset to 0
		await expect(page.getByText('count is 0')).toBeVisible();
	});

	test('should handle a sequence of operations correctly', async ({ page }) => {
		// Perform a sequence of operations
		await page.getByText('count is 0').click(); // 1
		await page.getByText('count is 1').click(); // 2
		await page.getByText('Decrement').click(); // 1
		await page.getByText('Increment').click(); // 2

		// Verify final count
		await expect(page.getByText('count is 2')).toBeVisible();
	});
});
