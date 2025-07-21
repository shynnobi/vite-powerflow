# Changelog

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
