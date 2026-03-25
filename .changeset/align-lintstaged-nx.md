---
'@vite-powerflow/create': patch
---

anchor: dad7e240a78a75173832d17e5763f05968a323c3

**CLI Template & Starter Alignment**

- Unified lint-staged configuration with inline Nx commands for both root and starter
- Removed legacy `.lintstagedrc-nx.js` files and standalone lint-staged scripts
- Fixed missing `lint-staged` and `commitlint` dependencies in starter package.json
- Aligned validate scripts output style (static vs dynamic)
- Removed obsolete CLI cleanup functions (`swapLintStagedConfig`)
- Fixed sync-starter-to-template to preserve full devDependencies
