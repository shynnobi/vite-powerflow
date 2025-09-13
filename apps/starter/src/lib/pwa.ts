// =============================================================================
// 📱 PWA TYPES & LOGIC
// TypeScript types and logic for PWA configuration
// =============================================================================

export type PWADisplayMode = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome' | `${string} ${string}`;
}

export interface PWAConfig {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: PWADisplayMode;
  start_url?: string;
  scope?: string;
  icons: PWAIcon[];
}

export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: PWADisplayMode;
  start_url: string;
  scope: string;
  icons: PWAIcon[];
}

// PWA Manifest Generator Function
export function generatePWAManifest(config: PWAConfig): PWAManifest {
  return {
    name: config.name,
    short_name: config.short_name,
    description: config.description,
    theme_color: config.theme_color,
    background_color: config.background_color,
    display: config.display,
    start_url: config.start_url ?? '/',
    scope: config.scope ?? '/',
    icons: config.icons,
  };
}

// Validation Functions
export function validateConfiguration(
  seoConfig: import('./seo.js').SEOConfig,
  pwaConfig: PWAConfig
): void {
  // Simple validation - can be enhanced
  if (!seoConfig.title) {
    console.warn('SEO: title is missing');
  }
  if (!pwaConfig.name) {
    console.warn('PWA: name is missing');
  }
  if (!pwaConfig.icons || pwaConfig.icons.length === 0) {
    console.warn('PWA: icons are missing');
  }
}
