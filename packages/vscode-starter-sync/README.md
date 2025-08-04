# Vite Powerflow - Starter Sync Extension

VS Code extension that monitors the sync status between **Vite Powerflow starter app** and **CLI template** in the monorepo, with automatic changeset detection and user-friendly notifications.

## ✨ Features

This extension helps maintain consistency in the **Vite Powerflow** monorepo by:

- **🔍 Real-time monitoring** of changes in `apps/starter` (React+Vite starter)
- **📦 Sync tracking** with `packages/cli/template` (embedded in CLI)
- **⚠️ Changeset detection** when version bumps are needed
- **🔔 Smart notifications** with actionable prompts
- **📊 Status bar integration** showing current sync state
- **📝 Persistent logging** in VS Code output channel

## 🚦 Status Indicators

- **✅ Synced** → Everything up-to-date, no action needed
- **⚠️ Warning** → Unreleased changes detected, changeset required
- **❌ Error** → Configuration issue or missing baseline

## 🎯 Smart Notifications

When unreleased changes are detected, the extension shows:

- **"Create Changeset"** → Opens terminal with `pnpm changeset` command
- **"Show Details"** → Opens output channel with detailed change information
- **Persistent output logs** → All checks and results saved for review

## 🚀 Installation

```bash
pnpm extension:deploy
```

<details>
<summary>Advanced: Manual steps</summary>

```bash
# Compile TypeScript
pnpm extension:compile

# Package for distribution
pnpm extension:package

# Install in VS Code
pnpm extension:install
```

</details>

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Compile TypeScript
pnpm extension:compile

# Run tests
pnpm --filter vite-powerflow-starter-sync run test

# Package for distribution
pnpm extension:package
```

## 💡 Usage

1. **Open Vite Powerflow workspace** in VS Code
2. **Check status bar** (bottom-left) for sync status indicator
3. **View detailed logs** by clicking status bar or using "Vite Powerflow: Run Sync Check" command
4. **Follow prompts** when unreleased changes are detected:
   - Click "Create Changeset" to start `pnpm changeset` workflow
   - Click "Show Details" to review specific changes in output channel

## ⚙️ How it works

The extension performs automated checks by:

1. **Reading baseline metadata** from:
   - `packages/cli/template/package.json` → `starterSource.commit` field
   - NPM registry for latest published CLI version

2. **Comparing commit history** between:
   - **Starter changes**: `apps/starter/` since template baseline
   - **CLI changes**: `packages/cli/` since published npm version

3. **Triggering notifications** when unreleased commits are detected

4. **Auto-watching** key files for real-time updates:
   - `.git/HEAD` and `.git/refs/heads/**` (branch changes)
   - `packages/cli/package.json` and `packages/cli/template/package.json`

## 📋 Requirements

- **VS Code** 1.60.0 or higher
- **Node.js** 16+ (for development)
- **Vite Powerflow monorepo** structure with:
  - `pnpm-workspace.yaml` in root
  - `apps/starter/` directory
  - `packages/cli/` directory

## 📄 License

MIT - See [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the Vite Powerflow ecosystem**
