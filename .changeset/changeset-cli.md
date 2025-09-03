---
'@vite-powerflow/create': minor
---

anchor: 9b9c0c65e5bc51da3e9ab2d873b59850d4978590

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
