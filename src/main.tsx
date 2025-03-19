import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@context/theme/ThemeProvider';

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
