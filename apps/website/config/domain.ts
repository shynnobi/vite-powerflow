// Centralized domain configuration
// Single source of truth for all domain-related settings

export interface DomainConfig {
  production: string;
  development: string;
  current: string;
  hostname: string;
  full: string;
}

export const DOMAIN_CONFIG: DomainConfig = {
  // Production domain
  production: 'https://vite-powerflow.netlify.app',

  // Development domain (optional, for local development)
  development: 'http://localhost:5173',

  // Get current domain based on environment
  get current(): string {
    return process.env.NODE_ENV === 'production' ? this.production : this.development;
  },

  // Get domain without protocol for sitemap generation
  get hostname(): string {
    return this.current.replace(/^https?:\/\//, '');
  },

  // Get full domain with protocol
  get full(): string {
    return this.current;
  },
};

// Export individual values for backward compatibility
export const DOMAIN = DOMAIN_CONFIG.production;
export const HOSTNAME = DOMAIN_CONFIG.hostname;

// Environment-specific helpers
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
