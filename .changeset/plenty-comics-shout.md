---
'@vite-powerflow/starter': minor
---

anchor: 5ee8eebc2797d8ef941626b439a325122f6b5615
baseline: 7438c181621b571a18810698cee0f35acee67129

feat(starter): add complete SEO and PWA infrastructure

**SEO Components:**

- Add SEO component with isHomepage prop for flexible title handling
- Add HelmetProvider for react-helmet-async support
- Add robots.txt template for search engine optimization
- Add Open Graph image for enhanced social sharing

**PWA Infrastructure:**

- Add PWA types, manifest generator, and validation functions
- Add complete favicon set (SVG, PNG, Apple touch icon)
- Add PWA manifest icons (192x192, 512x512)
- Update PWA theme colors to generic blue/gray scheme

**Build System:**

- Configure Vite with PWA, SEO, and sitemap plugins
- Add automatic sitemap generation with vite-plugin-sitemap
- Add HTML template processing with title injection
- Add compression and image optimization plugins
- Fix robots.txt plugin to ensure dist directory exists before copying

**Assets & Configuration:**

- Replace vite.svg with generic favicon structure
- Add project configuration types for reusable setup
- Integrate SEO component in Home page with isHomepage prop

**Build Configuration:**

- Reorder SEO plugins for proper robots.txt generation
- Remove invalid allowRobots option from sitemap plugin
- Ensure consistent robots.txt behavior between starter and website
- Update plugin execution order: Sitemap first, then robots override
