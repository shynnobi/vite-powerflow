// =============================================================================
// 📋 PROJECT CONFIGURATION
// Complete configuration for Vite PowerFlow starter template
// =============================================================================

import type { ProjectConfig } from '@/lib/config';

export const PROJECT_CONFIG: ProjectConfig = {
  // 🎯 SEO Configuration
  seo: {
    // TODO: Replace with your app's actual title (appears in browser tab)
    title: 'My App',
    // TODO: Write a compelling description for search engines (160 chars max)
    description: 'A modern React application built with Vite PowerFlow starter kit.',
    // TODO: Add relevant keywords for your app's content and audience
    keywords: 'react, vite, typescript, starter kit, modern web development',
    // TODO: Add your name or company name
    author: 'Your Name',

    // TODO: Replace with your app's social sharing image (1200x630px recommended)
    image: '/images/og-image-1200-630.png',

    // TODO: Update with your official site name (can be longer than title)
    siteName: 'My App',
    // TODO: Write a short tagline/slogan for your app
    siteDescription: 'Modern React development with Vite PowerFlow',

    // TODO: Replace with your actual Twitter/X handle
    twitterSite: '@yourusername',
    // TODO: Replace with your actual Twitter/X handle (usually same as twitterSite)
    twitterCreator: '@yourusername',
    twitterCard: 'summary_large_image' as const,

    // Content Types (used by search engines to categorize content)
    type: 'website' as const,
  },

  // 📱 PWA Configuration
  pwa: {
    // TODO: Update with your app's full name (for app stores/details)
    name: 'My App',
    // TODO: Set a short name for mobile home screen icons (prevents truncation)
    short_name: 'MyApp',
    // TODO: Write a compelling description for your PWA
    description: 'A modern React application built with Vite PowerFlow starter kit.',

    // TODO: Choose your app's theme color (affects browser UI when PWA is running)
    theme_color: '#32A8FF',
    // TODO: Choose your app's background color (consistent with theme)
    background_color: '#111111',

    // Display Mode
    display: 'standalone', // App-like experience (hides browser UI)

    // TODO: Update icon paths to match your actual favicon files
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
    // TODO: Replace with your actual production domain
    production: 'https://your-app-domain.com',

    // Development domain is managed by vite.config.ts (port 5173)
    // No duplication - Vite is the SSOT for dev server config
  },
} as const;
