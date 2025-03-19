import { test, expect } from '@playwright/test';

test.describe('Counter functionality', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the app before each test
		await page.goto('/');
	});

	test('should display initial counter value', async ({ page }) => {
		// Check if the counter is displayed with initial value
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('Count is 0');
	});

	test('should increment counter when clicking the increment button', async ({ page }) => {
		// Click the increment button
		await page.getByTestId('increment-button').click();

		// Check if the counter was incremented
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('Count is 1');
	});

	test('should decrement counter when clicking the decrement button', async ({ page }) => {
		// First increment to 1
		await page.getByTestId('increment-button').click();

		// Click the decrement button
		await page.getByTestId('decrement-button').click();

		// Check if the counter was decremented back to 0
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('Count is 0');
	});

	test('should reset counter when clicking the reset button', async ({ page }) => {
		// Increment multiple times
		await page.getByTestId('increment-button').click();
		await page.getByTestId('increment-button').click();

		// Verify count is 2
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('Count is 2');

		// Click the reset button
		await page.getByTestId('reset-button').click();

		// Check if the counter was reset to 0
		await expect(counterValue).toHaveText('Count is 0');
	});

	test('should handle a sequence of operations correctly', async ({ page }) => {
		// Perform a sequence of operations
		await page.getByTestId('increment-button').click(); // 1
		await page.getByTestId('increment-button').click(); // 2
		await page.getByTestId('decrement-button').click(); // 1
		await page.getByTestId('increment-button').click(); // 2

		// Verify final count
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('Count is 2');
	});
});
