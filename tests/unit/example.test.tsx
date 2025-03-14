// @ts-expect-error React is needed for JSX
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
	it('should render hello text', () => {
		render(<div>Hello</div>);
		const element = screen.getByText(/hello/i);
		expect(element).toBeInTheDocument();
	});
});
