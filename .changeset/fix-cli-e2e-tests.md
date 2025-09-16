---
'@vite-powerflow/create': patch
---

anchor: c1c371abeef3a4d5f12f697e50f6d1f57d6ad03e

## Fix CLI E2E Tests and Inline Shared Utilities

### 🐛 Bug Fixes

- **Fix E2E test failures**: Resolved `Unsupported URL Type "workspace:"` errors that prevented CLI installation in isolated npm environments
- **Fix TypeScript imports**: Corrected import extensions from `.ts` to `.js` for TypeScript compliance
- **Fix build script**: Removed unused `execSync` import and cleaned up code formatting

### 🔧 Technical Improvements

- **Inline shared utilities**: Updated `inline-shared-utils.ts` script to include CLI package as consumer
- **Autonomous CLI**: CLI now bundles `@vite-powerflow/shared-utils` utilities directly, eliminating workspace dependencies
- **NPM compatibility**: CLI can now be published and installed from npm without workspace dependency issues

### 📦 Package Changes

- Added inlined `logger.ts` utilities to `packages/cli/src/utils/shared/`
- Updated build process to use inlined utilities instead of external dependencies
- Removed workspace dependency from CLI package.json

This ensures the CLI works correctly in all environments and maintains compatibility with npm publication workflows.
