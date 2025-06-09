# Vite PowerFlow ⚡

A React + Vite starter, fully containerized for reproducible and collaborative development, with strict code quality tooling and AI pair programming workflow (Cursor rules). Includes comprehensive testing, linting, and CI/CD configurations following industry best practices.

<div align="center">
  <img src="public/vite.svg" alt="Vite Logo" width="100" />
  <br />
  <p>
    <strong>Vite PowerFlow</strong> - Your next React project, ready to go.
  </p>
</div>

<div align="center">

![Vite](https://img.shields.io/npm/v/vite?color=646CFF&label=Vite&logo=vite&logoColor=white)
![React](https://img.shields.io/npm/v/react?color=61DAFB&label=React&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/npm/v/typescript?color=3178C6&label=TypeScript&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/npm/v/tailwindcss?color=06B6D4&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/npm/v/vitest?color=6E9F18&label=Vitest&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/npm/v/playwright?color=2EAD33&label=Playwright&logo=playwright&logoColor=white)
![ESLint](https://img.shields.io/npm/v/eslint?color=4B32C3&label=ESLint&logo=eslint&logoColor=white)
![License](https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License)

</div>

## 🚀 Quick Start

Get started in minutes with a fully containerized, AI-optimized environment.

1. **Generate your app:**

   ```bash
   npx create-powerflow-app my-app
   ```

   > Alternative package managers:
   >
   > ```bash
   > # pnpm
   > pnpm create powerflow-app my-app
   >
   > # yarn
   > yarn create powerflow-app my-app
   > ```

2. **Open your new project in [Cursor](https://cursor.com) (recommended) or [VS Code](https://code.visualstudio.com)**

3. **Reopen in Container** when prompted (DevContainer)

4. **Start developing!**

> For the full AI pair programming experience, use Cursor with the pre-configured rules. In VS Code, Cursor rules are not available, but you can use other AI tools.

## 🤖 AI Pair Programming Workflow

Vite PowerFlow enables seamless collaboration between human developers and AI assistants through:

- **Project Planning**: Generate development prompts using our [Development Plan Generator](workflows/DEVELOPMENT_PLAN_GENERATOR.md), which provides:
  - A clear contract between humans and AI agents
  - Well-defined phases and milestones for tracking progress

### Cursor Integration (Premium)

For the best AI pair programming experience, use [Cursor](https://cursor.com) with our pre-configured rules:

- AI pair programming out-of-the-box with explicit, customizable rules
- Automated enforcement of code standards and best practices
- Seamless onboarding and knowledge sharing
- Enhanced collaboration with AI assistants

> **Note**: Cursor requires a paid subscription for AI features. However, you can still use Vite PowerFlow with any IDE (VS Code, WebStorm, etc.) - you'll just need to set up the development environment manually.

### Alternative Setup

If you prefer not to use Cursor, you can still benefit from all other features:

- Use any IDE of your choice
- Manual setup of development environment
- All core features remain available
- Same high-quality development experience

For detailed information about the AI pair programming workflow, see [AI Pair Programming](docs/ai-pair-programming.md).

## 📚 Documentation

- [Getting Started](docs/getting-started.md) – How to create and launch a new project
- [Development Environment](docs/development.md) – Setup, workflow, and available scripts
- [AI Pair Programming](docs/ai-pair-programming.md) – Cursor rules and AI integration
- [Architecture](docs/architecture.md) – Project structure, path aliases, and organization
- [Features](docs/features.md) – Core technologies and feature overview
- [Configuration](docs/configuration.md) – Key configuration files and environment variables
- [GitHub Permissions Setup](docs/github-permissions-setup.md) – How to configure GitHub tokens and permissions
- [GitHub CLI AI Setup](docs/github-cli-ai-setup.md) – Using the GitHub CLI and AI assistants in the container
- [GitHub CI Workflows Setup](docs/github-ci-workflows-setup.md) – Pre-configured GitHub Actions and automation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Credits

This starter template was created and is maintained by [Shynn](https://github.com/shynnobi)

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
[![Bluesky](https://img.shields.io/badge/Bluesky-@shynnobi-0560ff.svg?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/shynnobi.bsky.social)
[![Instagram](https://img.shields.io/badge/Instagram-@shynnobi-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/shynnobi_)
