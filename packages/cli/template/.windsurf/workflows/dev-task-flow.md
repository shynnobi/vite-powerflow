---
description: structured development execution flow
---

1. Start with a short problem analysis (cause, constraints, impacted scope).
2. Propose a technical plan before code changes.
3. Wait for explicit user validation when approach changes are significant.
4. Implement in small, verifiable steps.
5. Keep separation of concerns and avoid unrelated edits.
6. Run focused validation first (targeted tests/lint/typecheck), then broader checks if needed.
7. If revisions are requested, return to planning before more implementation.
8. Never run destructive git operations (`reset`, `revert`, `clean`) without explicit user approval.
