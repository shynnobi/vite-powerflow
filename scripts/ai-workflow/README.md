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

### `ai-github-cli-authenticate.sh`

- **Purpose**: Handles GitHub CLI authentication
- **Usage**: CI environments, automated GitHub operations
- **Features**:
  - Token-based authentication
  - Environment variable support
  - Automated setup for GitHub CLI

### `ai-commit-with-template.sh`

- **Purpose**: Manages Git commits with standardized formatting
- **Usage**: AI-driven commit creation
- **Features**:
  - Commit message templating
  - Conventional commits compliance
  - Optional body content
  - Line length validation

## Usage Notes

- These scripts are primarily intended for automated processes and AI operations
- They follow strict error handling and validation practices
- All scripts are designed to be non-interactive
- They can be integrated into CI/CD pipelines or used by AI assistants

## Error Handling

All scripts:

- Return appropriate exit codes
- Provide clear error messages
- Handle edge cases gracefully
- Clean up temporary resources

## Dependencies

- Node.js and pnpm
- Git
- GitHub CLI (for GitHub operations)
- Playwright (for E2E testing)
