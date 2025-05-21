import { expect, test } from '@playwright/test';

test.describe('Counter functionality', () => {
	test.beforeEach(async ({ page }) => {
		// Given: The user is on the home page
		await page.goto('/');
	});

	test('should show count of 0 when the counter is first displayed', async ({ page }) => {
		// Given: The counter is displayed
		// When: The page loads
		// Then: The counter should show 0
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('count is 0');
	});

	test('should increase the count by 1 when the increment button is clicked', async ({ page }) => {
		// Given: The counter shows 0
		// When: The user clicks the increment button
		await page.getByTestId('increment-button').click();

		// Then: The counter should show 1
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('count is 1');
	});

	test('should decrease the count by 1 when the decrement button is clicked', async ({ page }) => {
		// Given: The counter shows 0
		// When: The user increments to 1
		await page.getByTestId('increment-button').click();
		// And: The user clicks the decrement button
		await page.getByTestId('decrement-button').click();

		// Then: The counter should show 0
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('count is 0');
	});

	test('should reset the count to 0 when the reset button is clicked', async ({ page }) => {
		// Given: The counter shows 0
		// When: The user increments twice
		await page.getByTestId('increment-button').click();
		await page.getByTestId('increment-button').click();
		// And: The user clicks the reset button
		await page.getByTestId('reset-button').click();

		// Then: The counter should show 0
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('count is 0');
	});

	test('should correctly track the count through a sequence of increment and decrement operations', async ({
		page,
	}) => {
		// Given: The counter shows 0
		// When: The user performs a sequence of operations
		await page.getByTestId('increment-button').click(); // 1
		await page.getByTestId('increment-button').click(); // 2
		await page.getByTestId('decrement-button').click(); // 1
		await page.getByTestId('increment-button').click(); // 2

		// Then: The counter should show 2
		const counterValue = await page.getByTestId('counter-value');
		await expect(counterValue).toHaveText('count is 2');
	});
});
