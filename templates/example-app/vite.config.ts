import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import aliases from '../../vite.aliases.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: Object.entries(aliases).map(([find, replacement]) => ({
      find,
      replacement: path.resolve(__dirname, '..', '..', replacement),
    })),
  },
});
