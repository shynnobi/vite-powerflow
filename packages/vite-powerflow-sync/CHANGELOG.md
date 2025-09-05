# vite-powerflow-sync

## 0.0.2

### Patch Changes

- d7c822f: anchor: 72810e711c0532bd44e6ce4f2fe870d5b5aaa8fd

  feat(extension): enhance sync monitoring with dependency tracking
  - Add dependency-pending status for packages updated via internal deps
  - Integrate changeset status parsing to detect version bumps
  - Add extension self-monitoring with custom baseline from package.json
  - Improve status messages with future versions and trigger packages
  - Reorder package display: Starter → CLI → Utils → Extension
  - Remove extension from npm package monitoring (IDE extension only)
