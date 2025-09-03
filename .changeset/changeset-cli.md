---
'@vite-powerflow/create': minor
---

anchor: 422ef69d41e82339a10281285d633ab5cbecc73c

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
