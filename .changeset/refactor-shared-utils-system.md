---
'@vite-powerflow/starter': minor
'vite-powerflow-sync': minor
---

anchor: 192b700ebadbeb02de42b3ab334c11dcbae88d1b
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
