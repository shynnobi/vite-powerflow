import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as stories from '../../src/components/ui/button.stories';

// Compose all stories
const { Primary, Secondary, Destructive } = composeStories(stories);

describe('Button component', () => {
	it('renders primary button', () => {
		render(<Primary />);
		expect(screen.getByText('Button')).toBeInTheDocument();
	});

	it('renders secondary button', () => {
		render(<Secondary />);
		expect(screen.getByText('Button')).toBeInTheDocument();
	});

	it('renders destructive button', () => {
		render(<Destructive />);
		expect(screen.getByText('Button')).toBeInTheDocument();
	});
});
