// =============================================================================
// 📋 PROJECT CONFIGURATION
// Complete configuration for Vite PowerFlow website
// =============================================================================

import type { ProjectConfig } from '@/lib/config';

export const PROJECT_CONFIG: ProjectConfig = {
  // 🎯 SEO Configuration
  seo: {
    // Page titles (used in <title> tags - appears in browser tab title)
    title: 'Vite PowerFlow',
    // Meta description (160 chars max) - shown in search results under the title
    description:
      'This starter kit includes TypeScript, testing, CI/CD workflows, and containerized development - all configured with industry best practices.',
    keywords: 'vite, react, typescript, seo, pwa, react-router, sitemap, modern web',
    author: 'Shynn',

    // Image (1200x630) for social sharing previews (Open Graph, Twitter, etc.)
    image: '/images/og-default-1200-630.png',

    // Site branding (used in PWA, Open Graph, Twitter)
    siteName: 'Vite PowerFlow', // Official site name - can be longer than title
    siteDescription: 'Ultra-fast React development with modern tooling', // Short tagline/slogan

    // Twitter/X platform specific metadata
    twitterSite: '@vitepowerflow',
    twitterCreator: '@shynnobi',
    twitterCard: 'summary_large_image' as const,

    // Content Types (used by search engines to categorize content)
    type: 'website' as const,
  },

  // 📱 PWA Configuration
  pwa: {
    // App Identity (from SEO)
    name: 'Vite PowerFlow', // Full name for app stores/details
    short_name: 'PowerFlow', // Short name for mobile home screen icons (prevents truncation)
    description:
      'This starter kit includes TypeScript, testing, CI/CD workflows, and containerized development - all configured with industry best practices.',

    theme_color: '#111828', // Dark theme - affects browser UI when PWA is running
    background_color: '#111828', // Dark background - consistent with theme

    // Display Mode
    display: 'standalone', // App-like experience (hides browser UI)

    // App Icons - Multiple sizes for better compatibility
    icons: [
      {
        src: '/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/favicon/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },

  // 🌐 Domain Configuration
  domain: {
    // Production domain
    production: 'https://vite-powerflow.netlify.app',

    // Development domain is managed by vite.config.ts (port 5173)
    // No duplication - Vite is the SSOT for dev server config
    // Dynamic logic will be moved to @vite-powerflow/utils
  },
} as const;
