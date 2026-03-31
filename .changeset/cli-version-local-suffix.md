---
'@vite-powerflow/create': patch
---

anchor: 5d47b22187957a572d1a4d60ab2f9a5e95f35e51

Improve starter onboarding docs and CLI runtime version visibility.

- Update starter README setup/prerequisites guidance for clearer onboarding
- Show CLI version at startup for interactive runs
- Detect local executions and append a `+local.<sha>[.dirty]` suffix
- Keep npm-published execution versions clean (no local suffix)
- Refactor version logic into a dedicated utility for maintainability
