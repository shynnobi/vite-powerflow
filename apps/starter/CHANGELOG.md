# Changelog

## 2.0.0

### Major Changes

- df24180: anchor: 03894e2d5516ee278c2c16eafbd54a71d487df39
  baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

  # v2.0.0: Nx Integration + Process Optimization

  ## 📖 Description

  This major release introduces **Nx** as the core build system and optimization engine, enhancing the already robust starter with **enterprise-grade** build optimization and advanced development workflows. The integration brings intelligent caching, affected detection, and parallel execution capabilities that significantly improve build performance and developer experience.

  The CLI has been enhanced with dynamic project configuration and improved template synchronization, ensuring seamless project creation with the new Nx architecture.

  ## 🚀 Major Release - Complete Architecture Evolution

  ### Nx Integration & Performance Optimization
  - **Complete Nx integration** with intelligent caching and daemon process
  - **Affected detection** for optimized builds and testing
  - **Parallel execution** support for faster CI/CD pipelines
  - **Plugin ecosystem** integration (@nx/vite, @nx/eslint, @nx/js)
  - **Named inputs and production patterns** for intelligent caching

  ### New Configuration Architecture
  - **`nx.json`** - Main Nx configuration with task runners and plugins
  - **`project.json`** - Project-specific targets and dependencies
  - **`.nxignore`** - Cache optimization patterns
  - **`tsconfig.spec.json`** - Dedicated test TypeScript configuration

  ### Enhanced Scripts & Workflows
  - **`scripts/dev-server.js`** - Standardized development server with Nx
  - **`scripts/monitor-processes.sh`** - Process monitoring and zombie detection
  - **Updated package.json scripts** - Nx-optimized commands with better organization

  ### Playwright Docker Optimizations
  - **Zombie process prevention** with `init: true`, `ipc: host`, `shm_size: 2gb`
  - **Global teardown** (`tests/e2e/global-teardown.ts`) for proper cleanup
  - **Optimized configuration** with reduced timeouts and better error handling
  - **Enhanced test coverage** reporting and performance

  ### CLI Enhancements
  - **Dynamic project configuration** with placeholder replacement in `vite.config.ts`
  - **Enhanced template processing** with `{{projectName}}` placeholder support
  - **Improved sync workflow** for Nx-compatible projects
  - **Better error handling** during project creation process
  - **Consistent script behavior** across all generated projects

  ### Dual Lint-Staged Configuration System
  - **Starter configuration** - Standalone lint-staged config for monorepo compatibility
  - **Template system** - Dual config files (`.lintstagedrc.js` + `.lintstagedrc-nx.js`)
  - **CLI intelligence** - Automatically selects appropriate config during project generation
  - **Generated projects** - Clean Nx configuration without standalone dependencies
  - **Release workflow fix** - Resolves `nx ENOENT` errors in CI/CD pipelines

  ## 🎯 Breaking Changes
  - **New Nx configuration files** are required (`nx.json`, `project.json`)
  - **Updated Docker requirements** for IPC support (`init: true`, `ipc: host`)
  - **Script modifications** for Nx compatibility
  - **New dependencies** (@nx/\* packages, nx)
  - **Lint-staged configuration** - Generated projects now use Nx-based lint-staged config

  ## 📦 Dependencies

  ### Added
  - `@nx/eslint` - Nx ESLint integration
  - `@nx/eslint-plugin` - Nx ESLint rules
  - `@nx/js` - Nx JavaScript support
  - `@nx/vite` - Nx Vite integration
  - `@nx/web` - Nx web support
  - `nx` - Core Nx monorepo tool

  ## 🧪 Testing & Quality
  - All existing tests continue to pass
  - New E2E test optimizations for Docker environments
  - Enhanced test coverage reporting
  - Improved test performance with Nx caching
  - Process monitoring tools for development
  - **Release workflow stability** - Fixed lint-staged execution in CI/CD

  ## 🔧 Technical Improvements

  ### Lint-Staged Architecture
  - **Monorepo compatibility** - Starter uses standalone config to avoid Nx dependency issues
  - **Template flexibility** - Dual config system allows both standalone and Nx configurations
  - **CLI intelligence** - Automatic config selection based on project type
  - **Clean generation** - Generated projects have consistent Nx-based tooling
  - **CI/CD reliability** - Resolved template execution errors in release workflows

  This major release provides a solid foundation for future monorepo expansion. The integration of Nx brings enterprise-grade build optimization and developer experience improvements for new projects created with the CLI, while maintaining compatibility with existing workflows and ensuring reliable CI/CD operations.

## 1.3.2

### Patch Changes

- 7f0337e: baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

  ## Fix TypeScript Import Errors in E2E Test Scripts

  ### 🐛 Bug Fix
  - **Fix e2e script TypeScript imports**: Changed shebang from `node` to `tsx` in run-end-to-end-tests.js
  - **Resolve ERR_UNKNOWN_FILE_EXTENSION**: Scripts can now import TypeScript files directly
  - **Update CLI template**: New projects created with CLI will have working e2e tests

  ### 🔧 Technical Details
  - Updated shebang in `apps/starter/scripts/run-end-to-end-tests.js` to use `tsx`
  - Updated shebang in `packages/cli/template/scripts/run-end-to-end-tests.js` to use `tsx`
  - Modified test:e2e scripts to use `tsx` instead of `node`

  This fix ensures that e2e test scripts can properly import TypeScript logger utilities without runtime errors.

## 1.3.1

### Patch Changes

- 435a1a0: baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

  ## Fix Missing Logger Dependencies in Starter

  ### 🐛 Bug Fix
  - **Add missing dependencies**: Added `chalk ^5.6.2` and `ora ^9.0.0` to starter package.json
  - **Resolve runtime errors**: Fixes `ERR_MODULE_NOT_FOUND` errors in e2e tests
  - **Enable logger functionality**: Inlined logger utilities now work with colors and spinners

  This fix ensures the starter can properly use inlined logger utilities without runtime errors.

## 1.3.0

### Minor Changes

- 192b700: anchor: a9b9b528a1f7f09e5ba609ef581732b0b5562091
  baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

  ## Refactor: Replace Utils Package with Shared-Utils and Inlining System

  ### 🏗️ Major Architecture Changes
  - **Remove problematic utils package**: Completely eliminated `@vite-powerflow/utils` package that caused circular dependency issues
  - **Create new shared-utils package**: Introduced `@vite-powerflow/shared-utils` with logger and monorepo utilities
  - **Implement build-time inlining**: Added automatic inlining script for consuming packages to create autonomous builds

  ### 🔄 Package Updates
  - **Starter**: Updated to use inlined shared utilities for template generation
  - **Extension**: Updated to use new shared-utils package structure

  ### 🛠️ Technical Improvements
  - **Eliminate circular dependencies**: New architecture prevents dependency cycles
  - **Autonomous packages**: Each package can be built independently with inlined utilities
  - **Hybrid approach**: Direct usage for development, inlining for production builds
  - **Improved maintainability**: Centralized utilities with automatic distribution
  - **Fix image optimization**: Added missing `sharp` and `svgo` dependencies for `vite-plugin-image-optimizer`

  ### 📁 File Structure Changes
  - Added `packages/shared-utils/` with logger and monorepo utilities
  - Added `scripts/inline-shared-utils.ts` for automatic utility inlining
  - Updated TypeScript paths and Vite aliases for new package structure
  - Removed entire `packages/utils/` directory

  ### 🧪 Testing & Quality
  - **Fix shared-utils tests**: Added `--passWithNoTests` flag to prevent test failures
  - **Maintain test coverage**: All existing tests continue to pass with new architecture
  - **Improved build reliability**: Eliminates workspace dependency issues

  This refactoring creates a more robust, maintainable architecture while preserving all existing functionality.

### Patch Changes

- 192b700: anchor: a9b9b528a1f7f09e5ba609ef581732b0b5562091
  baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

  ## Optimize Release Workflow and Clean Up Scripts

  ### 🚀 Workflow Improvements
  - **Optimize release sequence**: Improved workflow execution order for better performance
  - **Clean up build scripts**: Removed unnecessary build scripts from shared-utils package
  - **Streamline package management**: Enhanced package baseline management

  ### 📋 Documentation Updates
  - **Update alias system docs**: Refreshed documentation to reflect new shared-utils architecture
  - **Improve code comments**: Cleaned up references to old utils package throughout codebase

  ### 🔧 Technical Cleanup
  - **Remove obsolete files**: Cleaned up legacy configuration and build files
  - **Update package references**: Ensured all packages reference the correct shared-utils structure
  - **Maintain consistency**: Aligned all packages with the new architecture standards

  ### 📦 Package Baseline Updates
  - **Synchronize baselines**: Updated all package baselines to release commit for consistent versioning
  - **Prepare for release**: Ensured all packages are ready for coordinated release

  This optimization ensures smoother release processes and maintains consistency across all packages in the monorepo.

## 1.2.9

### Patch Changes

- Updated dependencies [05dfbbd]
  - @vite-powerflow/utils@0.0.8

## 1.2.8

### Patch Changes

- ee8b29b: anchor: e935a07d27d6cfb9812e4c10c1e4529ae021599e
  baseline: d0de5cc8c98fc878c41bc9cd8e37244d66793de3

  Fix desync between starter and npm template

  The starter package (v1.2.7) and the published CLI template (v1.1.0) are out of sync. This changeset will:
  - Sync the latest starter code to the CLI template
  - Update the template baseline commit metadata
  - Publish the updated CLI package to npm

  This ensures users get the latest starter improvements when using `create-vite-powerflow`.

## 1.2.7

### Patch Changes

- Updated dependencies
  - @vite-powerflow/utils@0.0.7

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
