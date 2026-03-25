---
description: commit process and message quality
---

1. Inspect staged changes with `git diff --cached --stat` and `git diff --cached --name-only`.
2. Propose a commit strategy:
   - single atomic commit when scope is coherent
   - multiple commits when changes are unrelated
3. For each commit, propose a Conventional Commit message:
   - allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
   - header max 72 chars, imperative mood, no final period
   - body lines max 100 chars, in English
4. Wait for explicit user approval before committing.
5. Before each commit, run `git reset` to unstage all files.
6. Stage only files relevant to the approved commit plan.
7. Run commit normally (never use `--no-verify` unless explicitly approved by the user).
8. Verify result with `git log -n 1 --pretty=fuller` and `git status --short`.
