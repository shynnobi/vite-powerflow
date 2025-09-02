---
'@vite-powerflow/create': minor
---

anchor: af2acd5cc3ee5378267aba6855414aa103bb6a9e

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
