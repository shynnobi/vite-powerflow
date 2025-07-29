# Vite Powerflow - Starter Sync Monitor

VS Code extension that monitors the sync status between **Vite Powerflow starter app** and **CLI template** in the monorepo.

## What it does

This extension helps maintain consistency in the **Vite Powerflow** monorepo by:

- Monitoring changes in `apps/starter` (the reference React+Vite starter)
- Tracking sync status with `packages/cli/template` (embedded in the CLI)
- Detecting when changesets are needed for version bumps
- Warning when CLI template needs manual sync

## Status Indicators

- **✔ v1.0.0 synced** → Starter app and CLI template are in perfect sync
- **⚠️ v1.0.1 → Sync CLI** → Version was bumped (changeset applied), sync CLI template needed
- **🚨 Create changeset** → New commits in starter but version unchanged, create changeset first

## Installation

```sh
pnpm --filter vscode-starter-sync run package
code --install-extension packages/vscode-starter-sync/vscode-starter-sync-0.0.1.vsix
```

## Development

```sh
pnpm install
pnpm compile
pnpm package
```

## How it works

The extension reads metadata from:

- `apps/starter/package.json` → Current starter version
- `packages/cli/template/package.json` → Template metadata with `starterSource` field

It compares:

- **Versions**: Detect if changeset was applied
- **Commits**: Detect if new changes exist
- **Sync state**: Determine the appropriate action needed

## Structure

- `src/extension.ts` — Main extension logic
- `package.json` — Extension metadata and VS Code configuration
- `LICENSE` — MIT license
