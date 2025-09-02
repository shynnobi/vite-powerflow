import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

import { DOMAIN_CONFIG } from '../config/domain.js';

interface SitemapRoute {
  path: string;
  priority?: number;
  changefreq?: string;
  lastmod?: string;
  images?: string[];
}

interface SitemapConfig {
  hostname: string;
  routes?: SitemapRoute[];
  autoRoutes?: boolean;
  images?: boolean;
}

export function viteSitemapAdvanced(config: SitemapConfig): Plugin {
  const {
    hostname = DOMAIN_CONFIG.production,
    routes = [],
    autoRoutes = true,
    images = true,
  } = config;

  let detectedRoutes: SitemapRoute[] = [];

  return {
    name: 'vite-sitemap-advanced',

    // Hook to automatically detect routes
    configResolved(_resolvedConfig) {
      if (autoRoutes) {
        // Automatic route detection from source code
        detectedRoutes = detectRoutesFromSource();
      }
    },

    // Hook to generate the sitemap after the build
    closeBundle() {
      const allRoutes = [...routes, ...detectedRoutes];
      const sitemapXML = generateAdvancedSitemap(allRoutes, hostname, images);

      // Write the sitemap to the dist folder
      const distDir = path.resolve(process.cwd(), 'dist');
      const sitemapPath = path.join(distDir, 'sitemap.xml');

      try {
        fs.writeFileSync(sitemapPath, sitemapXML);
        console.log(
          `🎯 Advanced sitemap generated with ${allRoutes.length} routes at ${sitemapPath}`
        );
      } catch (error) {
        console.error('❌ Error writing sitemap:', error);
      }
    },
  };
}

// Function to detect routes from source code
function detectRoutesFromSource(): SitemapRoute[] {
  const routes: SitemapRoute[] = [];
  const srcDir = path.resolve(process.cwd(), 'src');

  try {
    // 1. Scan App.tsx for React Router routes
    const appPath = path.join(srcDir, 'App.tsx');
    if (fs.existsSync(appPath)) {
      const appContent = fs.readFileSync(appPath, 'utf8');

      // Regex to find React Router routes
      const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
      let match: RegExpExecArray | null;

      while ((match = routeRegex.exec(appContent)) !== null) {
        const routePath = match[1];
        routes.push({
          path: routePath,
          priority: routePath === '/' ? 1.0 : 0.8,
          changefreq: routePath === '/' ? 'daily' : 'weekly',
        });
      }
    }

    // 2. Scan the pages directory to detect potential pages
    const pagesDir = path.join(srcDir, 'pages');
    if (fs.existsSync(pagesDir)) {
      const pageDirs = fs
        .readdirSync(pagesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      pageDirs.forEach(pageDir => {
        const routePath = `/${pageDir.toLowerCase()}`;
        // Don't add if route already exists or if it's the home page
        if (!routes.find(r => r.path === routePath) && pageDir.toLowerCase() !== 'home') {
          routes.push({
            path: routePath,
            priority: 0.7,
            changefreq: 'monthly',
          });
        }
      });
    }

    // 3. Scan components to detect dynamic routes
    const componentsDir = path.join(srcDir, 'components');
    if (fs.existsSync(componentsDir)) {
      scanComponentsForRoutes(componentsDir, routes);
    }

    console.log(`🔍 Auto-detected ${routes.length} routes from source code`);
  } catch (_error) {
    console.warn('⚠️  Error scanning routes from source:', _error);
  }

  return routes;
}

// Scan components to detect dynamic routes
function scanComponentsForRoutes(componentsDir: string, routes: SitemapRoute[]): void {
  try {
    const files = fs.readdirSync(componentsDir, { withFileTypes: true });

    files.forEach(file => {
      if (file.isDirectory()) {
        scanComponentsForRoutes(path.join(componentsDir, file.name), routes);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        const filePath = path.join(componentsDir, file.name);
        const content = fs.readFileSync(filePath, 'utf8');

        // Detect links or routes in components
        const linkRegex = /href=["']([^"']+)["']/g;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(content)) !== null) {
          const linkPath = match[1];
          if (linkPath.startsWith('/') && !routes.find(r => r.path === linkPath)) {
            routes.push({
              path: linkPath,
              priority: 0.6,
              changefreq: 'monthly',
            });
          }
        }
      }
    });
  } catch {
    // Ignore read errors
  }
}

// Advanced sitemap generation
function generateAdvancedSitemap(
  routes: SitemapRoute[],
  hostname: string,
  includeImages: boolean
): string {
  const now = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

  if (includeImages) {
    xml += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  }

  xml += '>\n';

  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${hostname}${route.path}</loc>\n`;
    xml += `    <lastmod>${route.lastmod || now}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq || 'weekly'}</changefreq>\n`;
    xml += `    <priority>${route.priority || 0.5}</priority>\n`;

    // Add images if configured
    if (includeImages && route.images && route.images.length > 0) {
      route.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${hostname}${image}</image:loc>\n`;
        xml += '    </image:image>\n';
      });
    }

    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}
