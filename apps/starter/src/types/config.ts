// =============================================================================
// 📋 PROJECT CONFIGURATION TYPES
// TypeScript types for project configuration
// =============================================================================

import type { PWAConfig } from './pwa.js';
import type { SEOConfig } from './seo.js';

// Project Configuration Type (reusable across all projects)
export interface ProjectConfig {
  seo: SEOConfig;
  pwa: PWAConfig;
  domain: {
    production: string;
  };
}
