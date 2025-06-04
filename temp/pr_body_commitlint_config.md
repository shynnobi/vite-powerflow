# Pull Request

## Changes implemented

- All commit titles have been rewritten to strictly comply with the 72-character limit (commitlint compliance)
- Removed the `[skip ci]` tag from all commit titles for clarity and to ensure commitlint passes
- Deleted all temporary scripts and the `temp` directory used for commit rewriting and detection
- Reactivated Husky hooks (`pre-commit`, `pre-push`, `commit-msg`) after the history rewrite
- Resolved merge conflicts, especially on `pnpm-lock.yaml`, to align with the latest `dev` branch
- Cleaned up the repository for a maintainable and conventional commit history

## Tasks completed

- [x] Rewrote all problematic commit messages
- [x] Removed `[skip ci]` from commit titles
- [x] Deleted temporary scripts and cleaned up the `temp` directory
- [x] Reactivated Husky hooks
- [x] Resolved all outstanding merge conflicts

## Type of change

- [x] Refactor
- [x] CI/CD improvement
- [x] Chore/maintenance

## Quality assurance

- [x] All tests pass locally and in CI
- [x] Commitlint and Husky hooks are enforced
- [x] No temporary or obsolete files remain

---

**This PR brings the commit history and tooling in line with project standards and ensures a clean, maintainable base for future development.**
