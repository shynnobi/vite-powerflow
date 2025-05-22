import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import App from '@/App';

expect.extend(toHaveNoViolations);

describe('App', () => {
	it('should render the main heading when the application starts', () => {
		// Given: The application is mounted in a browser router
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);

		// When: The application renders
		// Then: The main heading should display the application title
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite PowerFlow ⚡');
	});

	it('should have no accessibility violations', async () => {
		const { container } = render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
