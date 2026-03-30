# AGENTS.md

> This file is the single source of truth for all AI agents working on this repository.
> It is an open standard (Agentic AI Foundation / Linux Foundation) and is read by Codex,
> Jules, Cursor, Windsurf, Copilot, Devin, Aider, and others.
> Claude Code reads `CLAUDE.md` as priority — a symlink or copy should be maintained.

## Project Overview

Vite PowerFlow is a monorepo-based development toolkit built with NX. It provides a CLI
for creating modern web applications with TypeScript, React, and best practices built-in.

## Setup Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Run tests: `pnpm test`
- Build project: `pnpm build`
- Lint code: `pnpm lint`
- Type check: `pnpm type-check`
- Quick validation: `pnpm validate:quick`
- Full validation: `pnpm validate:full`
- Static validation: `pnpm validate:static`

## Project Structure

```
vite-powerflow/
├── apps/
│   ├── starter/          # Demo application
│   └── starter-web/      # Web demo (excluded from builds)
├── packages/
│   ├── cli/             # CLI tool for project scaffolding
│   └── create/          # Core package published to npm
└── AGENTS.md           # AI assistant rules (single source of truth)
```

## Changeset Workflow

This project uses Changesets for version management and changelog generation. Follow this workflow when making changes to published packages:

### When to Create a Changeset

Create a changeset when you make changes that affect published packages:

- `@vite-powerflow/create` (CLI package published to npm)
- Any other packages that will be released

### Creating a Changeset

1. **Manual method (recommended for AI agents):**

   ```bash
   # Create a new markdown file in .changeset/ directory
   # File format: .changeset/[description].md

   ---
   "@vite-powerflow/create": patch|minor|major
   ---

   Brief description of changes for humans.
   ```

2. **Interactive method:**
   ```bash
   pnpm changeset
   ```

### Version Types

- **`patch`**: Bug fixes, minor improvements, documentation updates
- **`minor`**: New features, non-breaking changes
- **`major`**: Breaking changes, API modifications

### Example Changeset

```markdown
---
'@vite-powerflow/create': patch
---

Remove unnecessary logs from CLI project creation output for cleaner user experience.
```

### Verification

Check changeset status:

```bash
pnpm changeset status
```

## Important Constraints

- No direct edits under `packages/cli/template/**` — changes must be made in
  `apps/starter/**` and propagated via sync workflow
- `starter-web` is excluded from root builds and release workflow
- Use NX for monorepo management and task orchestration
- Use `pnpm` as package manager consistently
- Never use `--no-verify` on git operations without explicit user approval
- Never run destructive git operations without explicit approval
- Release workflow uses a granular npm token with bypass 2FA
- OIDC provenance signing is configured for npm packages
- Changesets manage versioning and changelog generation (`@vite-powerflow/create` is the
  main published package)

## Code Style

These rules apply where not already enforced by ESLint / Prettier config. Do not override
tool-detected conventions.

### TypeScript

- Strict mode enabled — explicit typing on all variables and function returns
- Use interfaces for object shapes, types for unions
- Prefer `const` assertions where appropriate

### React

- Functional components with hooks only
- PascalCase for component names; props interfaces prefixed with component name
- Feature-based architecture over technical separation
- Comments only for complex, non-obvious logic

### Language & Versioning

- English for commit messages, code comments, docs, UI text, and identifiers
- Conversation language may follow user preference
- Follow official ecosystem conventions over custom patterns
- `package.json` / dependency files: precise semver (`^6.2.6`)
- `CHANGELOG.md`: precise versions (`6.2.6`) with detailed entries
- Technical docs: major or minor only (`Vite 6.x`)
- UI / marketing text: major version only (`Vite 6`)
- When updating dependencies for security, only update relevant version references

## Development Workflow

### Formalism by Task Type

Adapt process weight to the nature of the task:

| Task type            | Formalism | Key requirement                          |
| -------------------- | --------- | ---------------------------------------- |
| Architectural change | High      | Extensive docs, multi-stage validation   |
| Feature development  | Medium    | Technical plan validated before coding   |
| Bug fix              | Adaptive  | Mandatory cause-effect analysis          |
| Refactoring          | Medium    | Before/after comparison, measurable goal |
| Quick fix            | Low       | Streamlined, simplified validation       |

### Task Execution Flow

1. Short problem analysis (cause, constraints, impacted scope)
2. Propose technical plan — wait for explicit validation before significant approach changes
3. Implement in small, verifiable steps; keep separation of concerns; avoid unrelated edits
4. Run focused validation first (targeted tests / lint / typecheck)
5. Return to planning if revisions are requested

### Process Management

- Check for running processes before starting servers
- Handle port conflicts when detected

## Testing Guidelines

- Use Given-When-Then pattern for test descriptions
- Write meaningful tests that cover edge cases
- Focus on behavior over implementation details
- Run tests after each significant change
- Apply TDD where relevant: tests first, implementation second

## Quality Standards

### Technical Rigor

- Prioritize technical rigor over speed when trade-offs are risky
- Flag deviations from best practices with explanation
- Base recommendations on maintainability, testability, and extensibility
- Challenge weak technical choices with concrete alternatives
- Assign confidence levels (high / medium / low) to recommendations
- Explicitly separate factual conclusions from speculative assumptions
- Proactively disclose limitations of proposed solutions

### Code Evaluation Criteria

Evaluate solutions against: performance (complexity, memory), maintainability
(readability, modularity), extensibility, and testability.

### Performance

- Profile before optimizing — identify actual bottlenecks
- Prefer readability over micro-optimizations unless performance is critical
- Consider algorithmic complexity (O notation) and memory usage patterns
- Suggest caching strategies and lazy loading where appropriate

### Error Handling

- Always provide clear error messages with actionable solutions
- Include context about what operation failed and why
- Suggest specific debugging steps when errors occur
- Never suppress errors without explicit user approval
- Log errors appropriately for debugging purposes

### Refactoring

- Clearly define scope and goals before starting
- Maintain backward compatibility unless explicitly approved to break it
- Provide before/after comparisons for significant structural changes
- Ensure all tests pass after refactoring
- Update documentation to reflect architectural changes
- Break large refactors into smaller, reviewable chunks

## Security Considerations

- Never commit secrets or API keys
- Validate inputs and sanitize outputs
- Review dependencies for known vulnerabilities
- Ensure error handling doesn't leak sensitive data
- Use HTTPS for all external communications
- Follow principle of least privilege for access controls
- Suggest security headers for web applications

## Git Workflow

### Commit Workflow

1. Analyze all staged changes using `git diff --cached`
2. Propose the most relevant commit plan (grouped or atomic) based on changes
3. For each planned commit, present title (header, 72 chars max) and body example
4. Wait for user validation
5. Before executing: run `git reset` to unstage all files
6. Stage only files relevant to each commit as planned
7. Inspect with `git diff --cached --stat` and `git diff --cached --name-only`
8. Single atomic commit when scope is coherent; multiple commits when changes are unrelated
9. Verify with `git log -n 1 --pretty=fuller` and `git status --short`

### Commit Message Guidelines

Follow Conventional Commit format:

- **Allowed types**: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`,
  `revert`, `style`, `test`
- **Header**: max 72 chars, imperative mood, no final period
- **Body**: max 100 chars per line, English, bullet points for multiple changes
- Describe scope and purpose clearly (what changed and why)
- Mention impacted technical elements (module names, scripts, templates, configs)
- Avoid raw file lists or overly generic descriptions

### Merge Conflict Resolution

- Analyze conflicts thoroughly before proposing resolutions
- Explain the implications of each conflicting change
- Propose resolution strategies that preserve intent from both sides
- Always test the resolution before finalizing
- Document the reasoning behind conflict resolution choices

## Pull Request Process

The project uses two distinct PR types. Identify the current branch and target to apply
the correct workflow.

### Branch Topology

```
feat/* or fix/* or chore/* etc.
        |
        |  PR type A — squash & merge on GitHub
        v
       dev          ← mirror branch, receives squash commits
        |
        |  PR type B — merge commit on GitHub
        v
       main
```

### PR Type A — feat/fix → dev (squash & merge)

1. Read all commits on the current branch since diverging from `dev`:
   `git log dev..HEAD --format="%h %s%n%b"`
2. Synthesize a single Conventional Commit title covering the full scope
3. Use `.github/pull_request_template.md` as base; fill in title, body, checklists
4. Create PR:
   `gh pr create --title "feat(scope): ..." --body-file /tmp/pr-body.md --base dev`
5. Verify:
   `gh pr view --json number,title,state,baseRefName | jq '.'`

### PR Type B — dev → main (sync PR)

1. List all squash commits on `dev` not yet on `main`:
   `git log main..dev --format="%H %s"`
2. Read full bodies to recover context:
   `git log main..dev --format="----%ncommit: %h%ntitle: %s%nbody:%n%b"`
3. Build PR body from template; explicitly mark this as a sync PR (`dev` → `main`); list
   source branches covered by the squash commits
4. Create PR:
   `gh pr create --title "feat(...): ..." --body-file /tmp/pr-body.md --base main`
5. Verify:
   `gh pr view --json number,title,state,baseRefName | jq '.'`

### PR Guidelines

- PR titles follow Conventional Commit format
- Fill all relevant sections of the PR template with detailed information
- Never create PRs without using the template structure
- For complex or multi-line bodies, always use `--body-file` with a temporary file

## GitHub CLI

- Always use `--json` flag for structured output
- Pipe through `jq` to filter and format results
- Avoid interactive commands that require manual input or paging
- For PR operations, prefer explicit flags (`--title`, `--body`) over interactive prompts
- Format complex outputs as single-line JSON to prevent terminal overflow
- Test commands with small result sets before running broader queries

## Architecture Guidelines

- Adapt architecture to project needs; avoid forcing technology choices
- Follow ecosystem patterns (React hooks, strict TypeScript, explicit naming)
- Record major architectural decisions and trade-offs in docs or PR notes
- Keep patterns consistent within each layer
- Maintain clear separation of concerns (UI, business logic, data access)
- Prioritize modularity and reusability
- Consider scalability, performance, and maintainability in all design choices

## Collaboration & Knowledge

### Session Wrapup

At the end of a collaboration session (interactive or batch task), produce a handoff
summary covering:

1. Context and objective of the session
2. Options considered and why they were accepted or rejected
3. Final decision and expected consequences
4. Key constraints and assumptions used
5. Follow-up actions and open technical questions
6. Documentation updates needed (if any)

For batch/autonomous agents: emit this summary as a structured block at the end of the
task output, even without an explicit user request.

### Decision Documentation Format

When recording a technical decision, use:

- **Context** — why the decision was needed
- **Options considered** — alternatives evaluated
- **Decision made** — what was chosen
- **Expected consequences** — trade-offs accepted
- **Follow-up points** — what remains open

### Knowledge Boundaries

- Proactively signal areas where knowledge may be incomplete or outdated
- Indicate last-known update date for rapidly evolving technologies
- Distinguish between established and emerging practices
- In case of uncertainty, present hypotheses and their implications
- Request clarification on project-specific conventions when they differ from standards
- Suggest reliable external resources when external research would be beneficial
