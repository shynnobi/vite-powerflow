import { type PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function ReactQueryProvider({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Default configuration for all queries
						staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
						gcTime: 10 * 60 * 1000, // Cache kept for 10 minutes (garbage collection time)
						retry: 1, // Only one retry attempt on failure
						refetchOnWindowFocus: true, // Refresh data when window regains focus
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} /> {/* DevTools in production mode */}
		</QueryClientProvider>
	);
}
