# Starter Project Enhancement Plan

> **Note**: This plan outlines key improvements and features to be implemented in the starter project, based on learnings from the `vpf-todo-app` development and best practices.

## Phase 1: Core Developer Experience (DX) & Project Setup

- [x] **SP-CORE-1**: Integrate the `.cursor` folder containing AI pair programming rules and configurations.
- [x] **SP-CORE-2**: Enhance `devcontainer.json` with essential VS Code extensions (e.g., for Markdown, Mermaid, linters, formatters) for a consistent development environment.
- [x] **SP-CORE-3**: Review and enforce strict TypeScript settings in `tsconfig.json` for robust type checking.
- [x] **SP-CORE-4**: Set up and integrate Prettier for consistent code formatting, including pre-commit hook integration.
- [x] **SP-CORE-5**: Implement pre-commit hooks using `husky` and `lint-staged` to automate linting, formatting, type checks, and commit message validation (`commitlint`).
- [x] **SP-CORE-6**: Initialize a `CHANGELOG.md` file following the "Keep a Changelog" format.
- [x] **SP-CORE-7**: Add a standard `pull_request_template.md` to the `.github` folder.
- [x] **SP-CORE-8**: Configure `dependabot.yml` in `.github` for automated dependency updates (referencing `vpf-todo-app`'s setup).
- [x] **SP-CORE-9**: Establish a basic CI workflow using GitHub Actions (`.github/workflows/`) for linting, testing, and building on pushes/PRs.

## Phase 2: Documentation & Developer Guidance

- [x] **SP-DOC-1**: Restructure documentation:
  - ✅ Create three focused GitHub documentation files: `docs/github-permissions-setup.md` (main reference), `docs/github-ci-workflows-setup.md`, and `docs/github-cli-ai-setup.md`
  - ✅ Update README.md to reference these new documentation files
  - ✅ Enhance documentation with clear guidance on GitHub token setup, permissions, CI workflows, and AI integration
  - ✅ Ensure documentation files reference each other with proper links
  - ✅ Update template README for generated projects
- [ ] **SP-DOC-2**: Update the main `README.md` to include core project information:
  - Overview of the project structure and architectural principles
  - Instructions for development setup and common tasks
- [ ] **SP-DOC-2.5**: _(To be completed after Phase 3)_ Add BDD testing documentation to README:
  - Guidance on the BDD testing approach implemented in the project
  - Examples of writing and organizing tests following BDD principles
- [ ] **SP-DOC-3**: Include a template or example `DEVELOPMENT_PLAN_MVP.md` file to guide project planning.
- [ ] **SP-DOC-4**: Include the `development plan prompt` (if it's a specific file/template you use for generating development plans).
- [ ] **SP-DOC-5**: Document clear architectural guidelines, including directory structure conventions (e.g., feature-based vs. type-based) and principles for separation of concerns.

## Phase 3: Testing Strategy & Implementation

- [ ] **SP-TEST-1**: Transition unit tests to a Behavior-Driven Development (BDD) approach, focusing on expected behaviors rather than implementation details.
- [ ] **SP-TEST-2**: Refactor existing tests or create new ones using helper functions/abstractions to decouple tests from specific implementations (e.g., state management).
- [ ] **SP-TEST-3**: Configure test coverage reporting in `vitest.config.ts` (or equivalent) to accurately reflect application code by excluding Storybook files, UI library components (e.g., Shadcn/ui), and other non-application logic.

## Phase 4: UI & Frontend Enhancements

- [ ] **SP-UI-1**: Implement a robust and easily customizable Dark Theme solution (e.g., using CSS variables).
- [ ] **SP-UI-2**: Define and document a clear UI component styling strategy, ensuring consistency with any chosen UI libraries (like Shadcn/ui if used).
- [ ] **SP-UI-3**: If Shadcn/ui (or a similar library) is part of the starter, provide patterns for its integration, customization, and theming.
- [ ] **SP-UI-4**: Configure Storybook with decorators to enable interactive documentation and showcase component variations effectively.
- [ ] **SP-UI-5**: Establish an accessibility (a11y) foundation:
  - Include basic a11y best practice guidelines in the documentation.
  - Provide an example of an automated accessibility test (e.g., using `axe-core`).
  - Ensure core components/examples follow a11y principles.

## Phase 5: Infrastructure Improvements

- [ ] **SP-INFRA-1**: Integrate improved Docker infrastructure from the todo app:
  - Add Docker Compose setup for consistent development environments
  - Configure appropriate container services and networking
  - Ensure proper volume mounting for development workflow
  - Document container-based development workflow
