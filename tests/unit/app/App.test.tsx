import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('App', () => {
	it('renders without crashing', () => {
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite PowerFlow ⚡');
	});
});
