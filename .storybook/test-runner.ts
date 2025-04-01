import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
	// Hook that is executed before the test runner starts running tests
	async preRender(page) {
		// Example: Wait for fonts to load
		await page.waitForLoadState('networkidle');
	},
	// Hook that is executed after a story is rendered
	async postRender(page, context) {
		// Example: Take screenshot of the story
		const storyId = context.id;
		await page.screenshot({ path: `./test-results/${storyId}.png` });
	},
};

export default config;
