---
'@vite-powerflow/create': patch
---

anchor: fae6ba8e7376ef21ceac98d8fd2e7b67b7609a1a

refactor: centralize release constants and improve DRY compliance

- Create constants/release-constants.ts as single source of truth for release commit messages and PR titles
- Add shared git-utils.ts with reusable commit detection logic for baseline calculation
- Update GitHub Actions workflow to dynamically read constants from TypeScript source
- Refactor baseline calculation scripts to use shared utilities instead of duplicated git log commands
- Fix baseline calculation timing issue by detecting latest release commit instead of using HEAD

This resolves the root cause of Starter package desynchronization and ensures all release-related constants are maintained in one location.
