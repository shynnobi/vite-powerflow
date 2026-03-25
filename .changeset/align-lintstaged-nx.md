---
'@vite-powerflow/create': patch
---

anchor: 925a5964825143d49b092a4530f6391bed12e9b6

**CLI Template & Starter Alignment**

- Unified lint-staged configuration with inline Nx commands for both root and starter
- Removed legacy `.lintstagedrc-nx.js` files and standalone lint-staged scripts
- Fixed missing `lint-staged` and `commitlint` dependencies in starter package.json
- Aligned validate scripts output style (static vs dynamic)
- Removed obsolete CLI cleanup functions (`swapLintStagedConfig`)
- Fixed sync-starter-to-template to preserve full devDependencies
