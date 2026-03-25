---
description: create pull requests with project template
---

1. Build PR context from commits, diff, and validation results.
2. Always use `.github/pull_request_template.md` as base content.
3. Create a temporary pre-filled file from the template.
4. Ensure PR title follows Conventional Commit style (`feat: ...`, `fix: ...`, etc.).
5. Fill relevant sections with concrete technical details and impacts.
6. Mark checkboxes in type-of-change and QA sections.
7. Create PR with GitHub CLI using body file (non-interactive), for example:
   - `gh pr create --title "..." --body-file /tmp/pr-body.md`
8. Prefer JSON-based GH queries for follow-up checks:
   - `gh pr view --json number,title,state,mergeStateStatus | jq '.'`
