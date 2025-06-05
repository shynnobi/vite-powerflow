# AI Workflow Scripts

This directory contains scripts specifically designed for AI-driven automation, continuous integration, and quality control processes.

## Scripts Overview

### `ai-code-quality-check.sh`

- **Purpose**: Orchestrates comprehensive code quality validation
- **Usage**: Pre-commit hooks, CI pipelines, AI-driven code validation
- **Features**:
  - Code formatting (Prettier)
  - Linting (ESLint)
  - Type checking (TypeScript)
  - Unit and integration tests
  - E2E tests

### `ai-run-e2e-tests.sh`

- **Purpose**: Manages end-to-end testing with Playwright
- **Usage**: CI pipelines, automated testing
- **Features**:
  - Automatic Playwright browser installation
  - E2E test execution
  - Configurable test reporter

### `ai-commit-with-template.sh`

- **Purpose**: Manages Git commits with standardized formatting
- **Usage**: AI-driven commit creation
- **Features**:
  - Commit message templating
  - Conventional commits compliance
  - Optional body content
  - Line length validation
