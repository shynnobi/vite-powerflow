# @vite-powerflow/example-utils — Package Template

This package is a **template** for creating new shared packages in the Vite Powerflow monorepo. It follows modern best practices: fast builds with **esbuild**, type generation with **TypeScript**, modular structure with **barrels**, and monorepo conventions.

---

## 🚀 Quick Checklist to Create a New Package

1. **Copy this folder** into `packages/` and rename it (`example-utils` → `your-new-package`).
2. **Update `package.json`**:
   - `name`: `@vite-powerflow/your-new-package`
   - Adjust `description`, `version`, etc.
3. **Adapt the source code** in `src/`:
   - Remove or replace the examples (`utils/example.ts`, etc.)
   - Add your own utilities, hooks, helpers…
4. **Define the public API** in `src/index.ts`:
   - Explicitly export every function/type you want to expose
   - Keep the `export {};` line at the top to ensure type declarations are generated
5. **Add tests** in the same folder or in a `__tests__` directory.
6. **Run the build**:
   ```sh
   pnpm build
   ```
7. **Check the output** in `dist/` (JS bundle + `.d.ts` types)

---

## 📁 Package Structure

- `src/` — Package source code
  - `build.ts` — Build script (esbuild + tsc)
  - `index.ts` — Public entry point (main barrel)
  - `utils/` — Utilities folder (with generated sub-barrel `index.ts`)
- `dist/` — Final build output (JS + types)
- `package.json` — Metadata, scripts, dependencies
- `tsconfig.json` — TypeScript config (alias, build, exclusions)
- `vitest.config.ts` — Unit test config
- `eslint.config.js` — TypeScript/JS linting config

---

## ⚙️ Technical Specifics & Conventions

### Main barrel and sub-barrels

- `src/index.ts` **must** explicitly export everything public.
- Sub-barrels (`src/utils/index.ts`) are generated automatically with our custom barrel generator.
- **Never export test/dev files in a barrel.**

### Empty export (`export {};`)

- Placed at the top of `src/index.ts` to force TypeScript to generate the type declaration file (`dist/index.d.ts`), even if there are no exports or only type exports (which may be erased at compile time).
- This is a common and accepted workaround in the TypeScript ecosystem.

### Build stack

- **esbuild**: fast bundling, ESM support, minification, sourcemaps.
- **TypeScript (`tsc`)**: type declaration generation (`.d.ts`) only.
- Build script: `tsx src/build.ts && tsc --emitDeclarationOnly --outDir dist`
- TypeScript aliases (`@/`) are handled via the `@awalgawe/esbuild-typescript-paths-plugin` plugin.

### Test stack

- **Vitest** for unit tests (`*.test.ts`).
- Config: see `vitest.config.ts`.

### Linting & formatting

- **ESLint** (TypeScript + JS config)
- **Prettier** for formatting
- Scripts: `lint`, `lint:fix`, `format`, `format:fix`, `fix`

### TypeScript alias

- All internal imports use the `@/` alias (see `tsconfig.json`)
- Enables clean, portable imports:
  ```ts
  import { myFunction } from '@/utils/myFunction';
  ```

---

## 🛠️ Build Process Details

1. **esbuild** bundles the code from `src/index.ts`:
   - Entry: `src/index.ts`
   - Output: `dist/index.js` (ESM, minified, sourcemap)
   - Plugins: TypeScript alias handling
2. **tsc** generates type declarations (`.d.ts`) in `dist/`
3. **Exclusions**: test files and the build script are not included in the final build

---

## 🧩 Example: Adding a Utility

1. Create a file in `src/utils/`:
   ```ts
   // src/utils/myFunction.ts
   export function myFunction() {
     return 'Hello!';
   }
   ```
2. Add it to the utils barrel (generated automatically or manually):
   ```ts
   // src/utils/index.ts
   export * from './myFunction';
   ```
3. Export it in the public API:
   ```ts
   // src/index.ts
   export { myFunction } from './utils/myFunction';
   ```

---

## 🧑‍💻 Best Practices & Pitfalls

- **Do not export test/dev files** in barrels
- **Keep the package modular**: one utility per file
- **Document every export** (JSDoc or README)
- **Check type generation** after every API change
- **Follow the structure** for easy maintenance and onboarding

---

## 📚 References & Useful Links

- [esbuild](https://esbuild.github.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/modules.html)
- Custom barrel generator (`pnpm generate:barrels`)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

**This template is designed to ensure consistency, maintainability, and scalability for all packages in the monorepo.**
