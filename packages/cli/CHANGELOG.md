# Changelog

## 1.2.6

### Patch Changes

- Updated dependencies [d7fe39c]
  - @vite-powerflow/utils@0.0.6

## 1.2.5

### Patch Changes

- Updated dependencies [c3d3f11]
  - @vite-powerflow/utils@0.0.5

## 1.2.4

### Patch Changes

- cc01d0f: anchor: cc01d0f288103b1961ab4d150afe1f93644eb9ca
  baseline: e93f4cd6c6241f7b4a1241bf9faa567869f5518d

  Update CLI dependency on @vite-powerflow/utils
  - Align with manually published utils@0.0.4
  - Covers commit d7c822f feat/monorepo-improvements (#199)

## 1.2.3

### Patch Changes

- a6b9748: anchor: b2fb387894273b25af332af13f3f4cf24ccaaa6e

  Improve development workflow and package metadata
  - Remove automatic template sync from pre-commit hook to enable atomic commits
  - Add consistent package metadata (author, repository, homepage, bugs)
  - Update packageManager to pnpm@10.13.1
  - Fix TypeScript module resolution with explicit .js extensions in barrel generation

## 1.2.2

### Patch Changes

- 8b61810: anchor: fae6ba8e7376ef21ceac98d8fd2e7b67b7609a1a

  refactor: centralize release constants and improve DRY compliance
  - Create constants/release-constants.ts as single source of truth for release commit messages and PR titles
  - Add shared git-utils.ts with reusable commit detection logic for baseline calculation
  - Update GitHub Actions workflow to dynamically read constants from TypeScript source
  - Refactor baseline calculation scripts to use shared utilities instead of duplicated git log commands
  - Fix baseline calculation timing issue by detecting latest release commit instead of using HEAD

  This resolves the root cause of Starter package desynchronization and ensures all release-related constants are maintained in one location.

## 1.2.1

### Patch Changes

- 5575558: chore: update CLI template to sync with starter changes

## 1.2.0

### Minor Changes

- 422ef69: anchor: 9b9c0c65e5bc51da3e9ab2d873b59850d4978590

  Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.

### Patch Changes

- Updated dependencies [422ef69]
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
