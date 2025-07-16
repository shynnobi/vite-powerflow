# @vite-powerflow/example-utils

This package serves as a modern template for creating new shared packages in the monorepo, using **esbuild** for fast JS bundling and **TypeScript** for type generation.

## How to create a new package

1. **Copy this folder** into `packages/` and rename it to your new package name.
2. **Update `package.json`**:
   - Change the `name` field to `@vite-powerflow/your-package-name`.
   - Update any other relevant fields (description, version, etc.).
3. **Replace the example code** in `src/` with your own utilities, hooks, or components.
4. **Export your public API** by adding all functions, classes, or types you want to make available
   to consumers in the `src/index.ts` file. For example, if you have a utility function in
   `src/utils/example.ts`, export it from `src/index.ts` like this:

   ```ts
   export { exampleFunction } from './utils/example';
   ```

   Only exports defined in `src/index.ts` will be accessible to users who import your package.

5. **Add tests** in the same folder or in a `__tests__` directory.
6. **Build your package** with:
   ```sh
   pnpm build
   ```
   (This runs `tsx src/build.ts` for esbuild + type generation)

## Project structure

- `src/` — All source code, including the build script (`build.ts`).
- `src/build.ts` — The build script (esbuild + tsc for types). Uses local alias imports (`@/`).
- `src/index.ts` — The public entrypoint for your package (what consumers import).
- `dist/` — Build output (JS bundle and `.d.ts` types).

## TypeScript alias

- All internal imports use the alias `@/` (configured in `tsconfig.json`):
  ```json
  "paths": {
    "@/*": ["src/*"]
  }
  ```
- This keeps imports clean and consistent across all packages.

## Example function

See `src/exampleFunction.ts` for a sample utility function.

---

**Tips:**

- Keep each package focused on a single responsibility.
- Document your exports and usage.
- Use the same structure for all shared packages for consistency.
- Scripts and utilities (like `build.ts`) should also live in `src/` for best compatibility with TypeScript and alias resolution.
