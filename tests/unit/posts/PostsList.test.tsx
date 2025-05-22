import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { PostsList } from '@/components/examples/PostsList';

expect.extend(toHaveNoViolations);

const queryClient = new QueryClient();

describe('PostsList', () => {
	it('should have no accessibility violations', async () => {
		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
