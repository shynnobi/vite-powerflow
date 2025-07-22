# @vite-powerflow/create

Generate a new, production-ready [Vite PowerFlow](https://github.com/shynnobi/vite-powerflow) starter project in seconds.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Cursor AI Editor](https://www.cursor.com) or [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)
  > **Note:** For the best AI-assisted development experience, use [Cursor AI Editor](https://www.cursor.com).
  > If you prefer a classic setup, [Visual Studio Code](https://code.visualstudio.com/) works perfectly.

### Generate an app using the CLI tool

1. Run this command in your terminal:

   ```bash
   npx @vite-powerflow/create my-app
   ```

   > You can also run the CLI tool in non-interactive mode for faster setup. See [CLI Options](#cli-options)

2. Open the folder in your code editor

3. `Reopen in Container` when prompted (Dev Container)

   ![DevContainer Prompt](https://www.dropbox.com/scl/fi/9rm4he8t53h9l30wz10vm/reopen-500.jpg?rlkey=dbrafybaezjnce85vj3b7p2jm&st=b22afec3&raw=1)

4. Wait for the installation (It can take a few minutes)

5. Launch dev server:

   ```bash
   pnpm dev
   ```

6. Start developing! 🚀

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

For full documentation, features, and advanced usage, see the [Vite PowerFlow monorepo README](https://github.com/shynnobi/vite-powerflow#readme).
(WIP: Vite Powerflow website coming soon )

---

MIT License
