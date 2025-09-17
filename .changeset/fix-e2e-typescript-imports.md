---
'@vite-powerflow/create': patch
'@vite-powerflow/starter': patch
---

baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

## Fix TypeScript Import Errors in E2E Test Scripts

### 🐛 Bug Fix

- **Fix e2e script TypeScript imports**: Changed shebang from `node` to `tsx` in run-end-to-end-tests.js
- **Resolve ERR_UNKNOWN_FILE_EXTENSION**: Scripts can now import TypeScript files directly
- **Update CLI template**: New projects created with CLI will have working e2e tests

### 🔧 Technical Details

- Updated shebang in `apps/starter/scripts/run-end-to-end-tests.js` to use `tsx`
- Updated shebang in `packages/cli/template/scripts/run-end-to-end-tests.js` to use `tsx`
- Modified test:e2e scripts to use `tsx` instead of `node`

This fix ensures that e2e test scripts can properly import TypeScript logger utilities without runtime errors.
