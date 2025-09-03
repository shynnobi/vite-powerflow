---
'@vite-powerflow/create': patch
---

fix: prevent race condition in release workflow and add validation

This release includes critical fixes to the release process:

- Reordered operations to prevent race condition between sync and publish
- Added validation script to ensure all @vite-powerflow packages are published
- Improved error handling in sync-starter-to-template script
- Fixed release workflow to be more robust and reliable
