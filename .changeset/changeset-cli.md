---
'@vite-powerflow/create': minor
---

anchor: 1ee86cca7596b1b3c58d8b26edf4ed2a59f3db21

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
