# Migration: From Manual Bundling to Package-Based Architecture

## Context

This migration aims to remove all manual function bundling logic from the starter and adopt a robust, scalable, and conventional approach using published shared packages (npm or private registry). The goal is to ensure all shared utilities are consumed as real dependencies, both in the monorepo and in instantiated starters.

---

## Rationale

- Manual bundling of shared functions is fragile, hard to maintain, and not scalable.
- Publishing shared packages and consuming them as dependencies is the industry standard (used by all major monorepos and frameworks).
- This approach ensures DRY code, proper versioning, and easy updates across all consumers.

---

## Migration Steps (Checklist)

- [ ] **Remove all manual function bundling logic**
  - Delete scripts/utilities that attempt to extract or copy shared functions into the starter.
  - Remove any code in the CLI or starter template that references this logic.

- [ ] **Clean up the starter template**
  - Remove all references to shared packages that are not meant to be real dependencies.
  - Ensure only actual dependencies (to be installed via npm) are imported in the starter code.
  - Move any test/demo code using shared packages to a dedicated test or playground folder.

- [ ] **Update package.json generation for the starter**
  - Ensure the CLI or generator injects the correct dependencies and versions for shared packages (e.g., `@vite-powerflow/tools`, `@vite-powerflow/example-utils`).
  - Use the latest published version or a specific version as needed.

- [ ] **Publish all shared packages to npm (or a private registry)**
  - Make sure each shared package has a unique name and version.
  - Add clear README files (especially for example/test packages).
  - Use the correct scope (e.g., `@vite-powerflow/`).

- [ ] **Test imports in both monorepo and instantiated starter**
  - In the monorepo: test imports via workspace (local resolution).
  - In a new starter: test imports via npm (published version).

- [ ] **Document the new workflow**
  - Update the main README and/or docs/alias-system.md to reflect the new approach.
  - Explain the difference between internal aliases (`@/`) and inter-package imports (`@vite-powerflow/*`).
  - Document the publication and consumption process for shared packages.

- [ ] **Create PRs and merge to main**
  - Commit all changes.
  - Open a PR to `dev`, review, then merge to `main`.

- [ ] **(Optional) Automate version injection and publication**
  - Add scripts to fetch the latest published version of each shared package when generating a starter.
  - Automate npm publish and changelog generation if needed.

---

## Notes

- Example/test packages (like `example-utils`) can be published to reserve the scope and validate the workflow, but should be clearly marked as non-production in their README.
- This migration will make the project more maintainable, scalable, and aligned with industry best practices.

---

**Keep this file updated as you progress through the migration!**
