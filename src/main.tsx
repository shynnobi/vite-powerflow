import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@context/theme/ThemeProvider';

import App from './App';

import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
	<StrictMode>
		<ThemeProvider storageKey="vite-ui-theme">
			<App />
		</ThemeProvider>
	</StrictMode>
);
