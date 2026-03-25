---
'@vite-powerflow/create': patch
---

anchor: f4bf773c62b2dc00f41e6c31d4b25e89657d0b4f

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
