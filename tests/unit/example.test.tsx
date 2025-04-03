import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

describe('App Component', () => {
	it('should render the main heading', () => {
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);
		expect(screen.getByText(/Vite PowerFlow/i)).toBeInTheDocument();
	});
});
