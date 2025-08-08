# Changelog

## 1.0.1

### Patch Changes

- 512caaf: anchor: 99e44e1f682285f0a45934fc4a6e8c04fa1fac71
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
