# Starter Project Enhancement Plan

> **Note**: This plan outlines key improvements and features to be implemented in the starter project, based on learnings from the `vpf-todo-app` development and best practices.

## Phase 1: Core Developer Experience (DX) & Project Setup

- [ ] **SP-CORE-1**: Integrate the `.cursor` folder containing AI pair programming rules and configurations.
- [ ] **SP-CORE-2**: Enhance `devcontainer.json` with essential VS Code extensions (e.g., for Markdown, Mermaid, linters, formatters) for a consistent development environment.
- [ ] **SP-CORE-3**: Review and enforce strict TypeScript settings in `tsconfig.json` for robust type checking.
- [ ] **SP-CORE-4**: Set up and integrate Prettier for consistent code formatting, including pre-commit hook integration.
- [ ] **SP-CORE-5**: Implement pre-commit hooks using `husky` and `lint-staged` to automate linting, formatting, type checks, and commit message validation (`commitlint`).
- [ ] **SP-CORE-6**: Initialize a `CHANGELOG.md` file following the "Keep a Changelog" format.
- [ ] **SP-CORE-7**: Add a standard `pull_request_template.md` to the `.github` folder.
- [ ] **SP-CORE-8**: Configure `dependabot.yml` in `.github` for automated dependency updates (referencing `vpf-todo-app`'s setup).
- [ ] **SP-CORE-9**: Establish a basic CI workflow using GitHub Actions (`.github/workflows/`) for linting, testing, and building on pushes/PRs.

## Phase 2: Testing Strategy & Implementation

- [ ] **SP-TEST-1**: Transition unit tests to a Behavior-Driven Development (BDD) approach, focusing on expected behaviors rather than implementation details.
- [ ] **SP-TEST-2**: Refactor existing tests or create new ones using helper functions/abstractions to decouple tests from specific implementations (e.g., state management).
- [ ] **SP-TEST-3**: Configure test coverage reporting in `vitest.config.ts` (or equivalent) to accurately reflect application code by excluding Storybook files, UI library components (e.g., Shadcn/ui), and other non-application logic.

## Phase 3: Documentation & Developer Guidance

- [ ] **SP-DOC-1**: Update the main `README.md` to include:
  - Guidance on the BDD testing approach.
  - Overview of the project structure and architectural principles.
  - Instructions for development setup and common tasks.
- [ ] **SP-DOC-2**: Include a template or example `DEVELOPMENT_PLAN_MVP.md` file to guide project planning.
- [ ] **SP-DOC-3**: Include the `development plan prompt` (if it's a specific file/template you use for generating development plans).
- [ ] **SP-DOC-4**: Document clear architectural guidelines, including directory structure conventions (e.g., feature-based vs. type-based) and principles for separation of concerns.

## Phase 4: UI & Frontend Enhancements

- [ ] **SP-UI-1**: Implement a robust and easily customizable Dark Theme solution (e.g., using CSS variables).
- [ ] **SP-UI-2**: Define and document a clear UI component styling strategy, ensuring consistency with any chosen UI libraries (like Shadcn/ui if used).
- [ ] **SP-UI-3**: If Shadcn/ui (or a similar library) is part of the starter, provide patterns for its integration, customization, and theming.
- [ ] **SP-UI-4**: Configure Storybook with decorators to enable interactive documentation and showcase component variations effectively.
- [ ] **SP-UI-5**: Establish an accessibility (a11y) foundation:
  - Include basic a11y best practice guidelines in the documentation.
  - Provide an example of an automated accessibility test (e.g., using `axe-core`).
  - Ensure core components/examples follow a11y principles.
