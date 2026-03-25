---
'@vite-powerflow/create': patch
---

anchor: e5c77f3bd02e156090ca3c9ec01e8ca623d3187b

**CLI Template & Starter Alignment**

- Unified lint-staged configuration with inline Nx commands for both root and starter
- Removed legacy `.lintstagedrc-nx.js` files and standalone lint-staged scripts
- Fixed missing `lint-staged` and `commitlint` dependencies in starter package.json
- Aligned validate scripts output style (static vs dynamic)
- Removed obsolete CLI cleanup functions (`swapLintStagedConfig`)
- Fixed sync-starter-to-template to preserve full devDependencies
