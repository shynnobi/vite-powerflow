# Changelog

## 1.2.6

### Patch Changes

- Updated dependencies [d7fe39c]
  - @vite-powerflow/utils@0.0.6

## 1.1.0

### Minor Changes

- 84b2f0b: anchor: 84b2f0b9cdff8fc42619bf7fec2d19abb6e881fb
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

## 1.0.7

### Patch Changes

- Updated dependencies [c3d3f11]
  - @vite-powerflow/utils@0.0.5

## 1.0.6

### Patch Changes

- cc01d0f: anchor: cc01d0f288103b1961ab4d150afe1f93644eb9ca
  baseline: e93f4cd6c6241f7b4a1241bf9faa567869f5518d

  Update CLI dependency on @vite-powerflow/utils
  - Align with manually published utils@0.0.4
  - Covers commit d7c822f feat/monorepo-improvements (#199)

- Updated dependencies [cc01d0f]
  - @vite-powerflow/utils@0.0.4

## 1.0.5

### Patch Changes

- a6b9748: anchor: b2fb387894273b25af332af13f3f4cf24ccaaa6e
  baseline: 3c3c5f60743cbc51faf55504c35e61d8002817b5

  Optimize E2E testing and standardize package metadata
  - Optimize Playwright browser installation with pre-check logic
  - Improve build output visibility in E2E test scripts
  - Add consistent package metadata (author, repository, homepage, bugs)
  - Update packageManager to pnpm@10.13.1

## 1.0.4

### Patch Changes

- 422ef69: anchor: 9b9c0c65e5bc51da3e9ab2d873b59850d4978590
  baseline: 668ab2e8f19ec5a066bfdba3e5f2713f29078ff5

  Improves the developer experience and tooling robustness. The `lint-staged` configuration has been corrected to use portable, auto-fixing commands (`prettier --write`), ensuring a smoother pre-commit workflow. The end-to-end test script also now provides better visual feedback during setup.

- Updated dependencies [422ef69]
  - @vite-powerflow/utils@0.0.2

## 1.0.3

### Patch Changes

- 3109a8e: anchor: 0136ed3db1d4e7f5d3f67a95d841a258a175413a
  baseline: fc360bba4cbfcc9b0bb78cd2cfa1e102e3591cdc
  - Update .gitignore to ensure .vscode is tracked and not ignored in starter
  - Add \_vscode/settings.json and \_vscode/tailwind.json for template propagation
  - Improves maintainability and VS Code compatibility for starter projects

## 1.0.2

### Patch Changes

- 2c08de9: baseline: 76e0866c99ca1521b8b51160b438739a6d90a866

  Integrate refactor-docs branch changes:
  - Starter: Improve test config, coverage output, TypeScript include, and fix ThemeProvider import.
  - CLI: Enhance E2E test robustness and logging (increase timeout, add debug logs).
  - Add website app and starter template; harmonize config, docs, and test setup across monorepo.

## 1.0.1

### Patch Changes

- 512caaf: anchor: ed96b9e08633162840fc0c076a1d43509106edbb
  baseline: 668ab2e8f19ec5a066bfdba3e5f2713f29078ff5

  ### Refactor & Improvements
  - Refactor and reorganize Starter modules and tests for clarity and maintainability
  - Update ESLint configs for monorepo and Starter, add local overrides
  - Update package scripts and naming conventions for Starter workflow
  - Add and update unit tests for Starter modules, remove obsolete tests
  - Ensure all Starter changes are compatible and all tests pass

  docs(rules): simplify and clarify commit process automation
  - Streamline commit process rules for AI and contributors
  - Focus on staged changes, clear commit planning, and user validation
  - Remove interruption policy and examples for brevity
  - Make guidelines more concise and actionable

## 1.0.0

### Major Changes

- 336fed1: - Initial release of the Vite Powerflow starter in the monorepo
  - Modular and scalable React + Vite template, ready for production and team workflows
  - Fully containerized development environment (DevContainer, Docker Compose)
  - Strict code quality tooling: ESLint, Prettier, TypeScript, Commitlint, Husky, lint-staged
  - Modern UI stack: Tailwind CSS, shadcn/ui, Storybook, React 19, Zustand, TanStack Query
  - Comprehensive testing setup: Vitest (unit/integration), Playwright (E2E), Testing Library
  - Pre-configured scripts for build, lint, format, type-check, and test
  - Ready-to-use VS Code and DevContainer configuration for instant onboarding
  - Example features: counter, posts, theming, routing, state management
  - Modular project structure for easy extension and feature development
  - Automated validation and CI/CD workflows (GitHub Actions)

All notable changes to the Vite Powerflow starter will be documented in this file.
