# Vite Powerflow Sync

VS Code extension that monitors sync between the main monorepo packages (currently starter and CLI) and their templates/changesets.

## Installation & Build

```bash
pnpm ext:build      # Compile the extension (from root)
pnpm ext:pack       # Package the extension as .vsix (from root)
pnpm ext:install    # Install the extension in VS Code (from root)
pnpm ext:ship       # Build, package, and install in one step (from root)

# Test
pnpm ext:test       # Run extension tests (from root)
```

## Status Bar

The extension adds two status bar buttons:

- **Main status:**
  - `✅ Vite Powerflow: Sync` — All packages synchronized
  - `⚠️ Vite Powerflow: Warning` — Unpublished changes found, changeset required
  - `🚀 Vite Powerflow: Pending` — All changes have changesets, ready for publish
  - `❌ Vite Powerflow: Error` — Git/config issue or missing baseline
  - _Click to open output channel with detailed logs_

- **Refresh button:**
  - `🔄` — Manually trigger a sync check
  - _Click to run a new sync check immediately_

## What it does

Automatically monitors:

- Git commits and refs for all packages
- Each package's `package.json` (version, baseline)
- Changeset files and sync status for all packages

## Output Example

The output is available in the VS Code output channel under "Vite Powerflow Sync". Here's an example of what it looks like:

```
🔄 Sync Status Report - [2025-08-08 16:08:44]
═══════════════════════════════════════════════════════════

📦 [Starter] (v1.0.0)
   📄 Changeset: strong-garlics-grab.md (patch)
   📊 Coverage: 2/2 commits covered
   🎯 Ready for release

📦 [CLI] (v1.0.5)
   📄 Changeset: shy-things-stare.md (minor)
   📊 Coverage: 5/5 commits covered
   🎯 Ready for release

═══════════════════════════════════════════════════════════
🔄 Status: 🟡 PENDING
📋 Summary: All 2 packages ready
```

## Multi-package Monitoring

- Detects desyncs and pending changesets for starter and CLI
- Displays warnings and sync status for these packages
- Helps maintain release integrity across the monorepo

---

_Internal tool for Vite Powerflow contributors_
