---
'@vite-powerflow/create': patch
---

fix(release): overhaul and harden the release workflow

This meta-package update includes critical fixes to the entire release process to ensure its reliability and prevent CI failures.

- **Race Condition Fix**: The release script order has been corrected ( now runs before ) to prevent the CLI template from referencing unpublished package versions.
- **Lockfile Synchronization**: The script now automatically updates after versioning to prevent errors in CI.
