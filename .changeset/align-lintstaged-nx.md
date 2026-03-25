---
'@vite-powerflow/create': patch
---

anchor: 6d7b3c5d900ea55e4af0499bd90500cb2db39449

**CLI Template & Starter Alignment**

- Unified lint-staged configuration with inline Nx commands for both root and starter
- Removed legacy `.lintstagedrc-nx.js` files and standalone lint-staged scripts
- Fixed missing `lint-staged` and `commitlint` dependencies in starter package.json
- Aligned validate scripts output style (static vs dynamic)
- Removed obsolete CLI cleanup functions (`swapLintStagedConfig`)
- Fixed sync-starter-to-template to preserve full devDependencies
- Consolidated starter cursor rules: removed 10 duplicate/redundant files, aligned with root standards
- Added `.windsurfrules` and windsurf workflow files to starter template
- Optimized cursor rules token cost (alwaysApply: false for non-essential rules)
