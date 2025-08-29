// SEO Hooks and Utilities
// Separated from components to respect React Fast Refresh best practices

import { useLocation } from 'react-router-dom';

import { DOMAIN_CONFIG } from '../../config/domain';
import { SEO_DEFAULTS } from '../../config/site-config';

// Types to enforce SSOT (Single Source of Truth)
export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// Re-export SEO types and constants for external use
export { SEO_DEFAULTS, type SEOType, type TwitterCardType } from '../../config/site-config';

// Custom hook to standardize SEO usage
export function useSEO(config: SEOConfig = {}) {
  const baseConfig = {
    ...SEO_DEFAULTS,
    url: DOMAIN_CONFIG.production,
    ...config,
  };

  return {
    ...baseConfig,
    // Utility methods
    getFullTitle: () => baseConfig.title,
    getFullUrl: (path?: string) => (path ? `${DOMAIN_CONFIG.production}${path}` : baseConfig.url),
    getFullImage: (image?: string) =>
      image?.startsWith('http') ? image : `${DOMAIN_CONFIG.production}${image || baseConfig.image}`,
  };
}

// Hook to automatically detect current URL - KISS/DRY/YAGNI
export function useCurrentURL() {
  const location = useLocation();
  return `${DOMAIN_CONFIG.production}${location.pathname}`;
}
