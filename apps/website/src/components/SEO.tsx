import { Helmet } from 'react-helmet-async';

import { SEO_DEFAULTS } from '../../config/site-config';
import { useSEO } from '../hooks/useSEO';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
  author?: string;
}

export function SEO({ title, description, image, url, keywords, author }: SEOProps) {
  const seoConfig = useSEO({
    title,
    description,
    image,
    url,
    keywords,
    author,
  });

  const siteName = SEO_DEFAULTS.siteName;
  const siteDescription = SEO_DEFAULTS.siteDescription;

  // Compose the full title for SEO
  const defaultTitle = seoConfig.title || SEO_DEFAULTS.title;
  const fullTitle =
    defaultTitle === siteName
      ? `${siteName} | ${siteDescription}`
      : `${defaultTitle} | ${siteName}`;

  // Use validated and processed URLs from useSEO hook
  const fullUrl = seoConfig.getFullUrl();
  const fullImage = seoConfig.getFullImage();

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={seoConfig.description} />
      <meta name="keywords" content={seoConfig.keywords} />
      <meta name="author" content={seoConfig.author} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoConfig.description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={SEO_DEFAULTS.ogType} />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={SEO_DEFAULTS.twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seoConfig.description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
