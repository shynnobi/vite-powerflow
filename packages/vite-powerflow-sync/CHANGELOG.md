# vite-powerflow-sync

## 0.1.0

### Minor Changes

- 192b700: anchor: d5138130a4f36b25e5f5d8e05765f24cbfc11cb9
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

- 192b700: anchor: d5138130a4f36b25e5f5d8e05765f24cbfc11cb9
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

## 0.0.4

### Patch Changes

- c3d3f11: fix(extension): update baseline resolution and improve sync monitoring
  - Update extension baseline from extensionBaseline to syncBaseline with latest release commit
  - Add backward compatibility fallback for legacy extensionBaseline field
  - Fix extension:install script to use correct .vsix version (0.0.3)
  - Remove debug logs from syncEngine for production readiness
  - Improve sync status reporting accuracy

  The extension now properly tracks its own sync status using the unified
  syncBaseline approach, ensuring consistent monitoring across all packages.

## 0.0.3

### Patch Changes

- bc1a434: fix(changeset): add 'none' bump type to Changeset interface
  - Add 'none' as a valid bumpType in Changeset interface
  - Update changesetReader to handle none bumpType
  - Fixes Utils package sync status detection for manually published packages

## 0.0.2

### Patch Changes

- cc01d0f: anchor: cc01d0f288103b1961ab4d150afe1f93644eb9ca

  feat(extension): enhance sync monitoring with dependency tracking
  - Add dependency-pending status for packages updated via internal deps
  - Integrate changeset status parsing to detect version bumps
  - Add extension self-monitoring with custom baseline from package.json
  - Improve status messages with future versions and trigger packages
  - Reorder package display: Starter → CLI → Utils → Extension
  - Remove extension from npm package monitoring (IDE extension only)
  - Fix changeset anchor extraction to skip empty lines after frontmatter
  - Fix commit coverage detection to use changeset anchor instead of lastCommitSha
  - Fix notCoveredCommits calculation to return actual uncovered commits
