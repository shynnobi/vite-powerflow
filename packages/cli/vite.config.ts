import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@starter': path.resolve(__dirname, '../starter/src'),
      '@cli': path.resolve(__dirname, './src'),
      '@tools': path.resolve(__dirname, '../tools'),
    },
  },
});
