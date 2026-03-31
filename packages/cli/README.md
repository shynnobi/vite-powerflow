# @vite-powerflow/create

Generate a new, production-ready [Vite PowerFlow](https://github.com/shynnobi/vite-powerflow) starter project in seconds.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- Your favorite code editor
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) (optional, for containerized development)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (optional, required only for Docker setup)

### Setup Steps

1. **Create project with CLI:**

   ```bash
   npx @vite-powerflow/create my-app
   ```

   > You can also run the CLI tool in non-interactive mode for faster setup. See [CLI Options](#cli-options)

2. **Open the folder in your code editor:**

   ```bash
   cd my-app
   code .  # or open with your preferred editor
   ```

3. **Choose your preferred development approach:**

#### 🐳 Docker Setup

If you installed the Dev Containers extension, you'll see a "Reopen in Container" prompt:

1. Click `Reopen in Container` (or use the command palette)
   - The first time, wait for the installation (can take a few minutes)
   - On subsequent launches, you'll connect directly to the container

2. Launch dev server:

   ```bash
   pnpm dev
   ```

#### 💻 Local Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Launch dev server:

   ```bash
   pnpm dev
   ```

Start developing! 🚀

<hr>

### CLI Options

The CLI tool supports the following options for non-interactive usage:

| Flag/Argument                  | Description                                  |
| ------------------------------ | -------------------------------------------- |
| `[project-directory]`          | The name of the project directory (required) |
| `-g, --git`                    | Initialize Git repository                    |
| `-u, --git-user-name <name>`   | Git user.name (required with --git)          |
| `-e, --git-user-email <email>` | Git user.email (required with --git)         |
| `-o, --use-global-git`         | Use global Git identity if found             |

## Documentation

- **Website:** [vite-powerflow.netlify.app](https://vite-powerflow.netlify.app/)
- **GitHub:** [Vite PowerFlow monorepo](https://github.com/shynnobi/vite-powerflow#readme)

For full documentation, features, and advanced usage, visit the official website or explore the repository.

---

MIT License
