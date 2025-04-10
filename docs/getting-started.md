# Getting Started

This guide will help you get started with Vite PowerFlow. Follow these steps to set up your development environment and start building your application.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Git](https://git-scm.com/) (optional)

## Installation

### Option 1: Using the Official CLI (Recommended)

The easiest way to create a new Vite PowerFlow project is using our CLI:

```bash
# Using npx
npx create-powerflow-app my-app

# Or using global installation
npm install -g create-powerflow-app
create-powerflow-app my-app
```

The CLI currently provides basic project setup capabilities:

- Customize project name
- Set project description
- Add author information
- Initialize Git repository (optional)

### Option 2: Manual Installation

1. Clone the repository:

```bash
# Using degit
pnpm degit shynnobi/vite-powerflow my-app

# Or using git
git clone https://github.com/shynnobi/vite-powerflow.git my-app
```

2. Navigate to the project directory:

```bash
cd my-app
```

3. Install dependencies:

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

This will start the development server at `http://localhost:5173`.

## Building for Production

Build your application for production:

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Testing

Run the test suite:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## Documentation

Generate documentation:

```bash
# Storybook
pnpm storybook

# API documentation
pnpm docs
```

## Project Structure

```
my-app/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── App.tsx        # Root component
├── tests/
│   ├── unit/          # Unit tests
│   └── e2e/           # E2E tests
├── docs/              # Documentation
└── package.json       # Project configuration
```

## Next Steps

- Check out the [Features](./features.md) documentation
- Learn about the [Project Architecture](./architecture.md)
- Explore the [Development Guide](./development.md)
- Read the [Configuration Guide](./configuration.md)
