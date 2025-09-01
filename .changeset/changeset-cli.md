---
'@vite-powerflow/create': minor
---

anchor: d8ab345b8d1a4bba266cfcd69e7ee8c8f11219b5

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
