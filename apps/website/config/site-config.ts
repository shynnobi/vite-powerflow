// =============================================================================
// 🎯 SEO DEFAULTS CONFIGURATION
// Single Source of Truth for all SEO-related metadata and branding
// Used by search engines, social media crawlers, and browser tabs
// =============================================================================

export const SEO_DEFAULTS = {
  // Page titles (used in <title> tags - appears in browser tab title)
  title: 'Vite PowerFlow',
  // Meta description (160 chars max) - shown in search results under the title
  description:
    'This starter kit includes TypeScript, testing, CI/CD workflows, and containerized development - all configured with industry best practices.',
  keywords: 'vite, react, typescript, seo, pwa, react-router, sitemap, modern web',
  author: 'Shynn',

  // Images for social sharing previews
  image: '/images/og-default.svg',
  ogImage: '/images/og-default.svg',
  twitterImage: '/images/og-default.svg',

  // Site branding (used in PWA, Open Graph, Twitter)
  siteName: 'Vite PowerFlow', // Official site name - can be longer than title
  siteDescription: 'Ultra-fast React development with modern tooling', // Short tagline/slogan

  // Twitter/X platform specific metadata
  twitterSite: '@vitepowerflow',
  twitterCreator: '@shynnobi',
  twitterCard: 'summary_large_image' as const,

  // Content Types (used by search engines to categorize content)
  type: 'website' as const,
  ogType: 'website' as const,
} as const;

// SEO Validation Rules
export const SEO_VALIDATION = {
  minTitleLength: 30,
  maxTitleLength: 60,
  minDescriptionLength: 120,
  maxDescriptionLength: 160,
  maxKeywordsCount: 10,
} as const;

// Common SEO Messages
export const SEO_MESSAGES = {
  titleRequired: 'SEO Warning: title is required for optimal SEO',
  descriptionRequired: 'SEO Warning: description is required for optimal SEO',
  titleTooShort: `SEO Warning: title should be at least ${SEO_VALIDATION.minTitleLength} characters`,
  titleTooLong: `SEO Warning: title should not exceed ${SEO_VALIDATION.maxTitleLength} characters`,
  descriptionTooShort: `SEO Warning: description should be at least ${SEO_VALIDATION.minDescriptionLength} characters`,
  descriptionTooLong: `SEO Warning: description should not exceed ${SEO_VALIDATION.maxDescriptionLength} characters`,
} as const;

// =============================================================================
// 📱 PWA DEFAULTS CONFIGURATION
// Progressive Web App manifest settings for native app-like experience
// Used by browsers to create app shortcuts and install prompts
// =============================================================================

export const PWA_DEFAULTS = {
  // App Identity (from SEO)
  name: SEO_DEFAULTS.siteName, // Full name for app stores/details
  shortName: 'PowerFlow', // Short name for mobile home screen icons (prevents truncation)
  description: SEO_DEFAULTS.description, // App Description (from SEO)

  themeColor: '#111828', // Dark theme - affects browser UI when PWA is running
  backgroundColor: '#ffffff', // Light background - splash screen color

  // Display Mode
  display: 'standalone', // App-like experience (hides browser UI)

  // App Icons
  icons: [
    {
      src: '/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
} as const;

// PWA Manifest Generator Function
export function generatePWAManifest() {
  return {
    name: PWA_DEFAULTS.name,
    short_name: PWA_DEFAULTS.shortName,
    description: PWA_DEFAULTS.description,
    theme_color: PWA_DEFAULTS.themeColor,
    background_color: PWA_DEFAULTS.backgroundColor,
    display: PWA_DEFAULTS.display,
    icons: PWA_DEFAULTS.icons as unknown as Array<{
      src: string;
      sizes: string;
      type: string;
    }>,
  };
}

// SEO Types for TypeScript
export type SEOType = typeof SEO_DEFAULTS.type;
export type TwitterCardType = typeof SEO_DEFAULTS.twitterCard;
export type PWADisplayMode = typeof PWA_DEFAULTS.display;
