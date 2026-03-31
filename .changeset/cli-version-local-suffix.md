---
'@vite-powerflow/create': patch
---

Improve CLI runtime version visibility and local build labeling.

- Show CLI version at startup for interactive runs
- Detect local executions and append a `+local.<sha>[.dirty]` suffix
- Keep npm-published execution versions clean (no local suffix)
- Refactor version logic into a dedicated utility for maintainability
