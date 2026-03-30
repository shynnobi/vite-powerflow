# AGENTS.md

> Essential agent guide for starter-based projects.
> Keeps implementation quality high without enforcing team-specific Git or PR workflows.
> It is an open standard (Agentic AI Foundation / Linux Foundation) and is read by Codex,
> Jules, Cursor, Windsurf, Copilot, Devin, Aider, and others.
> Claude Code reads `CLAUDE.md` as priority — a symlink or copy should be maintained.

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

Use `pnpm` as package manager consistently.

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
4. Run focused validation first (`pnpm validate:quick` or targeted checks)
5. Return to planning if revisions are requested

## Testing Guidelines

- Use Given-When-Then pattern for test descriptions
- Write meaningful tests that cover edge cases
- Focus on behavior over implementation details
- Run tests after each significant change
- Apply TDD where relevant: tests first, implementation second

## Quality Standards

- Prioritize technical rigor over speed when trade-offs are risky
- Flag deviations from best practices with explanation
- Base recommendations on maintainability, testability, and extensibility
- Assign confidence levels (high / medium / low) to recommendations
- Explicitly separate factual conclusions from speculative assumptions
- Prefer readability over micro-optimizations unless bottlenecks are proven
- Profile before optimizing — identify actual bottlenecks first

### Error Handling

- Always provide clear error messages with actionable solutions
- Include context about what operation failed and why
- Never suppress errors without explicit user approval

### Refactoring

- Clearly define scope and goals before starting
- Maintain backward compatibility unless explicitly approved to break it
- Provide before/after comparisons for significant structural changes
- Ensure all tests pass after refactoring
- Break large refactors into smaller, reviewable chunks

## Security

- Never commit secrets or API keys
- Validate inputs and sanitize outputs
- Review dependencies for known vulnerabilities
- Ensure error handling doesn't leak sensitive data
- Use HTTPS for all external communications
- Follow principle of least privilege for access controls

## Architecture Guidelines

- Adapt architecture to project needs; avoid unnecessary complexity
- Follow ecosystem patterns (React hooks, strict TypeScript, explicit naming)
- Record major architectural decisions and trade-offs in docs or PR notes
- Keep patterns consistent within each layer
- Maintain clear separation of concerns (UI, business logic, data access)
- Prioritize modularity and reusability

## Commit Policy

Follow Conventional Commit format:

- **Allowed types**: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`,
  `revert`, `style`, `test`
- **Header**: max 72 chars, imperative mood, no final period
- **Body**: max 100 chars per line, English, bullet points for multiple changes
- Describe scope and purpose clearly (what changed and why)
- Avoid raw file lists or overly generic descriptions
- Never use `--no-verify` unless explicitly approved

## Out of Scope

This starter version intentionally does not enforce:

- Branch strategy
- Pull request process
- Monorepo-specific constraints

Teams can define those practices according to their own workflow. For the full
vite-powerflow monorepo rules, refer to the root `AGENTS.md`.
