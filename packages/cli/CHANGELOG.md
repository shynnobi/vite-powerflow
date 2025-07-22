# Changelog

## 1.0.5

### Patch Changes

- 3957f39: Improve CLI tool robustness and user experience
  - Enhanced permission handling for .devcontainer/scripts/ and .husky/ directories
  - Updated CLI documentation with clearer usage examples
  - Replaced --name option with positional argument for simpler project creation
  - Added 'create' binary alias for improved developer experience
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
