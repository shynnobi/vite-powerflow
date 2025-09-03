# Changelog

## 1.2.0

### Minor Changes

- e125dce: anchor: 898125a4aadd3baeeab70d8ed4a08f0446677b64

  Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.

### Patch Changes

- d9c8de1: fix: prevent race condition in release workflow and add validation

  This release includes critical fixes to the release process:
  - Reordered operations to prevent race condition between sync and publish
  - Added validation script to ensure all @vite-powerflow packages are published
  - Improved error handling in sync-starter-to-template script
  - Fixed release workflow to be more robust and reliable

- Updated dependencies [e125dce]
  - @vite-powerflow/utils@0.0.2

## 1.1.2

### Patch Changes

- 3109a8e: anchor: 0136ed3db1d4e7f5d3f67a95d841a258a175413a
  - Refactor CLI build and create logic for robust \_vscode to .vscode handling and cleanup
  - Enforce .vscode folder presence in CLI template during build
  - Remove unused starterSource.version from scripts, types, and template package.json
  - Add \_vscode/settings.json and \_vscode/tailwind.json to CLI template
  - Update syncChecker, syncReporter, and types for new metadata structure
  - Improves release workflow clarity and maintainability

## 1.1.1

### Patch Changes

- 2c08de9: baseline: 76e0866c99ca1521b8b51160b438739a6d90a866

  Integrate refactor-docs branch changes:
  - Starter: Improve test config, coverage output, TypeScript include, and fix ThemeProvider import.
  - CLI: Enhance E2E test robustness and logging (increase timeout, add debug logs).
  - Add website app and starter template; harmonize config, docs, and test setup across monorepo.

## 1.1.0

### Minor Changes

- 512caaf: anchor: ed96b9e08633162840fc0c076a1d43509106edbb

  ### Refactor & Improvements
  - Refactor and reorganize CLI core modules and tests for clarity and maintainability
  - Update ESLint configs for monorepo and CLI, add local overrides
  - Refactor CLI build and project creation logic for robustness and type safety
  - Update package scripts and naming conventions for CLI workflow
  - Add and update unit tests for CLI modules, remove obsolete tests
  - Ensure all CLI changes are compatible and all tests pass

  ### Internal Changes
  - Updated end-to-end tests to use the correct `vite-powerflow-create` binary name, improving test reliability.

## 1.0.5

### Patch Changes

- 3957f39: Improve CLI tool robustness and user experience
  - Enhanced permission handling for .devcontainer/scripts/ and .husky/ directories
  - Updated CLI documentation with clearer usage examples
  - Replaced --name option with positional argument for simpler project creation
  - Fixed package publishing to exclude internal scripts folder

## 1.0.4

### Patch Changes

- b739801: - The CLI now sets executable permissions on all .sh files in scripts/ of generated projects.
  - CHANGELOG.md is no longer included in the CLI template or generated projects.
  - Fixed a TypeScript warning in the sync-starter-to-template script.

## 1.0.3

### Patch Changes

- 63040ca: fix: ensure VSCode settings are always included in generated projects
  - Rename .vscode to \_vscode in the template for npm compatibility
  - Explicitly include \_vscode in the npm package to guarantee VSCode settings are available
  - CLI now renames \_vscode to .vscode in generated projects
  - This makes the CLI/starter robust and portable across all npm workflows

## 1.0.2

### Patch Changes

- 52bc810: fix: ensure .vscode and postinstall.sh are always included and executable in published package
  - Explicitly include `dist/template/vscode` in the npm package to guarantee VSCode settings are available in generated projects.
  - Force executable permissions on `scripts/postinstall.sh` in the build output to prevent permission errors on install.
  - This makes the CLI/starter robust and portable across all platforms and npm workflows.

## 1.0.1

### Patch Changes

- 6239b77: fix(cli): Fix template packaging and add missing files
  - Move fs-extra to dependencies to fix runtime crash
  - Fix template path to use dist/template instead of source
  - Add .gitignore and .vscode to template (renamed to avoid npm ignore)
  - Update bin name to vite-powerflow-create to avoid conflicts
  - Clean up package.json files field
  - Simplify .npmignore configuration

## 1.0.0

### Major Changes

- 336fed1: - Initial release of the CLI in the monorepo
  - Complete redesign and new architecture for monorepo integration
  - Instantly scaffold a modern React + Vite PowerFlow app with a single command
  - Interactive prompts for project name, Git initialization, and Git identity
  - Automatic project setup:
    - Copies and customizes the starter template
    - Updates package.json, tsconfig, README, and DevContainer/Docker Compose configs
  - Optional Git repository initialization with local user config
  - Robust error handling and cleanup on failure
  - Ready-to-use scripts for build, lint, format, type-check, and test
  - Full support for containerized development environments (DevContainer, Docker Compose)

All notable changes to the CLI Vite Powerflow tool will be documented in this file.
