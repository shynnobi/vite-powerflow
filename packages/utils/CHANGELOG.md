# @vite-powerflow/utils

## 0.0.5

### Patch Changes

- c3d3f11: fix(sync): correct Utils package release commit detection and display
  - Fix lastReleaseCommitSha detection by searching in unfiltered commit history
  - Use findIndex instead of findLastIndex to get first release commit (published version)
  - Remove variable redeclaration that was overwriting lastReleaseCommitSha with undefined
  - Ensure Utils package displays (npm) + release commit in status report

  Resolves issue where Utils package showed warning status despite being
  synchronized with NPM published version. The release commit e2bdf2c4 was
  found but not properly assigned due to variable scope issues in syncEngine.

## 0.0.3

### Patch Changes

- Standardize package metadata and improve monorepo consistency
  - Add consistent author, repository, homepage, and bugs fields
  - Update packageManager to pnpm@10.13.1
  - Improve package.json structure alignment across monorepo

## 0.0.2

### Patch Changes

- Manually bump version to resolve publishing dependency conflicts.

## 0.0.1

### Patch Changes

- Initial release of the utility package.
