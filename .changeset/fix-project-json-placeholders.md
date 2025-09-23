---
'@vite-powerflow/create': minor
'@vite-powerflow/starter': minor
---

anchor: 8ced8cd82fdbb637e0a35b6c831f729ac06720bc
baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

feat: comprehensive starter optimization and Nx integration

## Starter Configuration & Structure

- Move type definitions to dedicated `src/types/` directory (seo.ts, pwa.ts, config.ts)
- Remove unused logger utilities and dependencies (chalk, ora, jiti, npm-run-all, listr2)
- Simplify counterStore.ts by replacing logger.warn with console.warn
- Delete unused files: src/index.ts, src/utils/hello-utils.ts, tests/unit/example.test.ts

## Nx Integration & Optimization

- Add complete Nx configuration (nx.json, project.json) with native executors
- Implement Nx targets for test, test:coverage, test:e2e, preview, storybook, build-storybook
- Add Nx-specific scripts and dependencies (@nx/storybook, @chromatic-com/storybook)
- Create E2E and Storybook setup/cleanup scripts with container detection
- Optimize Vitest configuration with proper include patterns and reporters

## Template Generation & CLI

- Update create.ts to handle {{projectName}} placeholders in project.json, vite.config.ts, vitest.config.ts
- Improve sync-starter-to-template.ts for better template transformation
- Add Git initialization and commit logic with detailed comments
- Handle lint-staged configuration switching (standalone → Nx)

## Configuration & Generic Setup

- Make projectConfig.ts more generic with placeholders and empty fields
- Update Home.tsx to use generic titles and descriptions
- Improve E2E test comments and structure
- Add comprehensive .nxignore and .gitignore files

## Turbo Integration

- Optimize turbo.json for monorepo-wide test caching
- Add globalDependencies and outputs configuration
- Maintain Turbo compatibility in monorepo while enabling Nx in generated projects

This major update transforms the starter into a fully optimized Nx-ready template while maintaining Turbo compatibility in the monorepo root.
