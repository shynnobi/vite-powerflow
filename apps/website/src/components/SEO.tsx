import { Helmet } from 'react-helmet-async';

import { PROJECT_CONFIG } from '@/config/projectConfig';
import type { SEOProps } from '@/lib/seo';

export function SEO({ title, description, image, url, keywords, author }: SEOProps) {
  // Use passed values with fallbacks to PROJECT_CONFIG defaults
  const seoTitle = title || PROJECT_CONFIG.seo.title;
  const seoDescription = description || PROJECT_CONFIG.seo.description;
  const seoImage = image || PROJECT_CONFIG.seo.image;
  const seoUrl = url || PROJECT_CONFIG.seo.url;
  const seoKeywords = keywords || PROJECT_CONFIG.seo.keywords;
  const seoAuthor = author || PROJECT_CONFIG.seo.author;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={seoAuthor} />

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={PROJECT_CONFIG.seo.type} />
      <meta property="og:site_name" content={PROJECT_CONFIG.seo.siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={PROJECT_CONFIG.seo.twitterCard} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
}
