# Vite React TypeScript Starter Kit

A modern and robust starter kit for React web application development, configured with current best practices and tools.

## 🚀 Features

- ⚡️ **[Vite](https://vitejs.dev/)** - Lightning fast build tool
- ⚛️ **[React 18](https://react.dev/)** - Latest React version with Hooks
- 📝 **[TypeScript](https://www.typescriptlang.org/)** - Static typing for robust code
- 🧪 **Complete Testing Setup** :
  - 🃏 [Vitest](https://vitest.dev/) for unit and integration tests
  - 🎭 [Playwright](https://playwright.dev/) for E2E testing
  - 🧪 [@testing-library/react](https://testing-library.com/react) for component testing
- 📏 **Code Quality** :
  - [ESLint](https://eslint.org/) with latest flat config (v9)
  - [Prettier](https://prettier.io/) for code formatting
  - [TypeScript ESLint](https://typescript-eslint.io/) for TypeScript-specific rules
- 🔍 **Pre-commit hooks** :
  - [Husky](https://typicode.github.io/husky/) for git hooks
  - [lint-staged](https://github.com/okonet/lint-staged) for staged files linting
  - [commitlint](https://commitlint.js.org/) for standardized commit messages

## 📦 Project Structure

\`\`\`
├── src/ # Application source code
├── tests/ # Tests organized by type
│ ├── e2e/ # End-to-end tests with Playwright
│ ├── integration/ # Integration tests
│ └── unit/ # Unit tests
├── public/ # Static files
├── .husky/ # Git hooks configuration
├── eslint.config.js # ESLint configuration (flat format)
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite configuration
└── vitest.config.ts # Vitest configuration
\`\`\`

## 🚀 Getting Started

1. Clone the project:
   \`\`\`bash
   git clone [REPO_URL]
   cd vite-blank-starter
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Start development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

## 🧪 Testing

- Unit and Integration tests:
  \`\`\`bash
  pnpm test # Run all tests
  pnpm test:watch # Watch mode
  pnpm test:ui # Vitest UI interface
  \`\`\`

- E2E tests:
  \`\`\`bash
  pnpm test:e2e # Run E2E tests with Playwright
  pnpm test:e2e:ui # Run E2E tests with Playwright UI
  \`\`\`

## 🛠️ Available Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm preview\` - Preview production build
- \`pnpm lint\` - Check code with ESLint
- \`pnpm format\` - Format code with Prettier
- \`pnpm type-check\` - Check TypeScript types

## 📝 Code Conventions

- **TypeScript**: Strict mode enabled
- **ESLint**: Modern configuration with React and TypeScript support
- **Commits**: Conventional Commits format
  - \`feat:\` New features
  - \`fix:\` Bug fixes
  - \`chore:\` Maintenance tasks
  - \`docs:\` Documentation changes
  - \`test:\` Test modifications

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## 📄 License

MIT
