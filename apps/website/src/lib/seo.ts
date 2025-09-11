// =============================================================================
// 🔍 SEO TYPES
// TypeScript types for SEO configuration
// =============================================================================

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
  siteName?: string;
  siteDescription?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export interface SEOProps {
  title: string; // Required - each page should have a unique title
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  author?: string;
}
