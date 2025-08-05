# Vite Powerflow Starter Sync

VS Code extension that monitors sync between `apps/starter` and `packages/cli/template`.

## Installation

```bash
pnpm extension:deploy
```

## Status Bar & Status Logic

The extension adds two status bar buttons:

- **Main status:**
  - `✅ Vite Powerflow: Sync` — No unpublished changes (everything synchronized)
  - `⚠️ Vite Powerflow: Warning` — Unpublished changes found, changeset required
  - `🚀 Vite Powerflow: Pending` — All changes have changesets, ready for publish
  - `❌ Vite Powerflow: Error` — Git/config issue or missing baseline
  - _Click to open output channel with detailed logs_

- **Refresh button:**
  - `🔄` — Manually trigger a sync check
  - _Click to run a new sync check immediately_

## What it does

Automatically monitors:

- `.git/HEAD` and `.git/refs/heads/**` (Git commits)
- `packages/cli/package.json` (CLI version)
- `packages/cli/template/package.json` (template metadata)

**Starter App:** Compares with baseline commit in `packages/cli/template/package.json`
**CLI Package:** Compares with latest npm version of `@vite-powerflow/create`

## Development

```bash
pnpm extension:test
pnpm extension:compile
pnpm extension:package
pnpm extension:build    # compile + package
pnpm extension:deploy   # compile + package + install
```

## Requirements

- VS Code 1.102.0+
- Vite Powerflow monorepo with `pnpm-workspace.yaml`
- `apps/starter/` and `packages/cli/` directories
- Initialized Git repository

---

_Internal tool for Vite Powerflow contributors_
