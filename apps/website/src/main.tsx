import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

// Safari font-size adjustment using utility functions
import { applySafariFontAdjustment } from './utils/browser-utils';

import './index.css';

if (typeof window !== 'undefined') {
  const result = applySafariFontAdjustment(-2);
  if (result) {
    console.log(`Safari detected: ${result.original}px → ${result.adjusted}px (SSOR -2px)`);
  }
}

import App from '@/App';
import { ThemeProvider } from '@/context/theme/ThemeProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
);
