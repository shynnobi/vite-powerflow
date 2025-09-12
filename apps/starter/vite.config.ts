/**
 * Vite PowerFlow Configuration
 * React + PWA + SEO setup
 */

import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin, PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import { PROJECT_CONFIG } from './src/config/projectConfig.js';
import { generatePWAManifest, validateConfiguration } from './src/lib/pwa.js';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import Sitemap from 'vite-plugin-sitemap';

// Validate configuration on startup
validateConfiguration(PROJECT_CONFIG.seo, {
  ...PROJECT_CONFIG.pwa,
  icons: [...PROJECT_CONFIG.pwa.icons],
});

// Vite plugins
const robotsPlugin = (): Plugin => {
  return {
    name: 'robots-plugin',
    closeBundle() {
      const targetPath = path.resolve(process.cwd(), 'dist/robots.txt');

      try {
        // Ensure dist directory exists
        const distDir = path.dirname(targetPath);
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }

        // Generate robots.txt content
        const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${PROJECT_CONFIG.domain.production}/sitemap.xml`;

        fs.writeFileSync(targetPath, robotsContent, 'utf-8');
        console.log('🤖 Robots.txt generated with security rules');
      } catch (error) {
        console.error('❌ Error generating robots.txt:', error);
      }
    },
  };
};

export default defineConfig({
  plugins: [
    // Core
    react(),
    visualizer() as PluginOption,
    tailwindcss(),
    tsconfigPaths(),

    // Optimization
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80, progressive: true },
      webp: { quality: 80 },
    }),
    compression(),

    // PWA
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
      },
      manifest: generatePWAManifest({
        ...PROJECT_CONFIG.pwa,
        icons: [...PROJECT_CONFIG.pwa.icons],
      }),
    }),

    // SEO
    Sitemap({
      hostname: PROJECT_CONFIG.domain.production,
      dynamicRoutes: ['/'],
      exclude: ['/admin', '/private', '/confidentiel'],
    }),
    robotsPlugin(), // Generate robots.txt after sitemap (will override)

    // Build
    createHtmlPlugin({
      minify: true,
      template: 'index.html',
      inject: {
        data: {
          VITE_APP_TITLE: PROJECT_CONFIG.seo.title,
        },
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      './tests/*.{test,spec}.{js,jsx,ts,tsx}',
      './tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
      './**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
      './**/__tests__/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
