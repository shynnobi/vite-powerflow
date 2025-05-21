import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

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
});
