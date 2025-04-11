# Changelog

All notable changes to the Vite PowerFlow project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Path aliases for cleaner imports throughout the codebase
- GitHub CLI pre-installed in DevContainer for streamlined GitHub workflow
- Structured GitHub CLI usage guidelines in `.cursorrules` for consistent developer experience

### Changed

- Updated terminology from "starter kit" to "starter template" throughout the project
- Enhanced keywords in package.json to better reflect project features and technologies
- Updated license copyright to correctly reference "Vite PowerFlow Starter Template"
- Implemented modular documentation structure for improved organization
- Reorganized test files by domain for better maintainability
- Renamed e2e test files following Playwright conventions
- Improved dependency management and documentation
- Updated Vite from 6.2.5 to 6.2.6 to address security vulnerability

### Fixed

- Added missing @utils path alias in configuration files
- Patched server.fs.deny bypass vulnerability in Vite (CVE-pending)

### Documentation

- Enhanced README with comprehensive structure and Credits section
- Added navigation references in getting started documentation
- Added changelog references to documentation
- Enhanced .cursorrules with ecosystem conventions and safety measures
- Improved development guidelines with detailed sections and table of contents
- Removed CONTRIBUTING.md and updated README to reflect changes in project structure
- Added social media badges to author section

### Dependencies

- Updated development dependencies with security patches and new features
- Updated production dependencies for improved performance and compatibility

## [1.1.0] - 2025-04-03

### Added

- Integrated TanStack Query v5.71 for robust data fetching and caching
  - Added TanStack Query Provider setup
  - Configured TanStack Query DevTools for development
  - Implemented example usage with Posts feature
  - Added proper error handling and loading states

### Changed

- Updated project documentation to reflect new data fetching capabilities
- Enhanced README with TanStack Query version and documentation links
- Improved test organization and conventions:
  - Reorganized tests by domain (counter, posts, app)
  - Aligned e2e test naming with Playwright conventions
  - Improved test setup and mock management
  - Enhanced test maintainability and readability

### Improved

- Enhanced development guidelines:
  - Added ecosystem-specific conventions
  - Strengthened safety measures for Git operations
  - Improved code organization principles

## [1.0.0] - Initial Release

### Added

- Core Features
  - Vite 6.2 build system
  - React 19.1 with TypeScript 5.3
  - Tailwind CSS 4.0 with shadcn/ui 0.8
  - Zustand 5.0 state management
  - Comprehensive testing setup (Vitest, Playwright, Testing Library)
  - ESLint 9.0 and Prettier 3.2
  - Git hooks with Husky 9.0
- Development Environment
  - Dev Container support
  - Hot Module Replacement (HMR)
  - TypeScript path aliases
  - Storybook 8.6 integration
- Documentation
  - Detailed README
  - Code conventions
  - Project structure
