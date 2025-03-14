import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		visualizer({
			open: true,
			filename: 'dist/stats.html',
			gzipSize: true,
			brotliSize: true,
		}),
	],
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					react: ['react', 'react-dom'],
				},
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		host: true,
	},
});
