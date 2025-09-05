---
'vite-powerflow-sync': patch
---

anchor: 4e419c5d76c4cf9ab890b9a22ae35b712c592480

feat(extension): enhance sync monitoring with dependency tracking

- Add dependency-pending status for packages updated via internal deps
- Integrate changeset status parsing to detect version bumps
- Add extension self-monitoring with custom baseline from package.json
- Improve status messages with future versions and trigger packages
- Reorder package display: Starter → CLI → Utils → Extension
- Remove extension from npm package monitoring (IDE extension only)
