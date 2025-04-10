# Getting Started

This guide will help you set up and run a new Vite PowerFlow project.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+) - _recommended package manager_
- [Git](https://git-scm.com/) (optional)

## Installation

### Option 1: Using the CLI (Recommended)

The fastest way to create a new project:

```bash
# Using npx (no installation required)
npx create-powerflow-app my-app

# OR with global installation
npm install -g create-powerflow-app
create-powerflow-app my-app
```

The CLI helps you:

- Set project name and description
- Add author information
- Initialize Git repository (optional)

### Option 2: Manual Installation

```bash
# Using degit (no git history)
pnpm degit shynnobi/vite-powerflow my-app

# OR using git clone (includes git history)
git clone https://github.com/shynnobi/vite-powerflow.git my-app

# Navigate to project and install dependencies
cd my-app
pnpm install
```

## Available Scripts

| Command              | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `pnpm dev`           | Starts the development server at http://localhost:5173 |
| `pnpm build`         | Builds the app for production in the `dist` folder     |
| `pnpm preview`       | Previews the production build locally                  |
| `pnpm test`          | Runs all tests with Vitest                             |
| `pnpm test:unit`     | Runs unit tests only                                   |
| `pnpm test:e2e`      | Runs E2E tests with Playwright                         |
| `pnpm test:coverage` | Generates test coverage report                         |
| `pnpm lint`          | Lints the codebase                                     |
| `pnpm format`        | Formats code with Prettier                             |
| `pnpm storybook`     | Starts Storybook for component development             |

## Versioning

Vite PowerFlow follows [Semantic Versioning](https://semver.org/). Check the [CHANGELOG.md](../CHANGELOG.md) for updates.
