/**
 * Vite PowerFlow Configuration
 * React + PWA + SEO setup
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import { DOMAIN_CONFIG } from './config/domain.js';
import { generatePWAManifest, SEO_DEFAULTS } from './config/site-config.js';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteSitemapAdvanced } from './plugins/vite-sitemap-advanced.ts';
import { viteRobotsCopy } from './plugins/vite-plugin-robots-copy.ts';
import viteHtmlValidate from './plugins/vite-html-validate.ts';
import { createHtmlPlugin } from 'vite-plugin-html';

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
      manifest: generatePWAManifest(), // Generated from centralized SEO config
    }),

    // SEO
    viteSitemapAdvanced({
      hostname: DOMAIN_CONFIG.production,
      autoRoutes: true,
      images: true,
    }),
    viteRobotsCopy(),

    // Quality
    viteHtmlValidate(),

    // Build
    createHtmlPlugin({
      minify: true,
      template: 'index.html',
      inject: {
        data: {
          VITE_APP_TITLE: SEO_DEFAULTS.title,
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
