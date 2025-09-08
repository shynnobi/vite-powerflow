# vite-powerflow-sync

## 0.0.3

### Patch Changes

- bc1a434: fix(changeset): add 'none' bump type to Changeset interface
  - Add 'none' as a valid bumpType in Changeset interface
  - Update changesetReader to handle none bumpType
  - Fixes Utils package sync status detection for manually published packages

## 0.0.2

### Patch Changes

- cc01d0f: anchor: cc01d0f288103b1961ab4d150afe1f93644eb9ca

  feat(extension): enhance sync monitoring with dependency tracking
  - Add dependency-pending status for packages updated via internal deps
  - Integrate changeset status parsing to detect version bumps
  - Add extension self-monitoring with custom baseline from package.json
  - Improve status messages with future versions and trigger packages
  - Reorder package display: Starter → CLI → Utils → Extension
  - Remove extension from npm package monitoring (IDE extension only)
  - Fix changeset anchor extraction to skip empty lines after frontmatter
  - Fix commit coverage detection to use changeset anchor instead of lastCommitSha
  - Fix notCoveredCommits calculation to return actual uncovered commits
