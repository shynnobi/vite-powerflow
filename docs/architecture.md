# Project Architecture

## Code Organization

Vite PowerFlow follows a feature-based architecture pattern where code is organized by its domain functionality rather than technical type.

## Directory Structure

```
├── src/                  # Application source code
│ ├── components/         # Reusable components
│ │ └── ui/               # shadcn/ui components with Storybook stories
│ ├── store/              # Zustand state management
│ ├── assets/             # Static assets (images, fonts, etc.)
│ ├── context/            # React context providers
│ ├── pages/              # Page components and routing
│ ├── lib/                # Third-party library configurations
│ ├── utils/              # Utility functions and helpers
│ └── shared/             # Shared types and interfaces
├── tests/                # Test files
│ ├── e2e/                # End-to-end tests (Playwright)
│ ├── integration/        # Integration tests
│ └── unit/               # Unit tests
├── public/               # Static files (served as-is)
├── .husky/               # Git hooks configuration
├── docs/                 # Documentation files
├── config files          # Configuration files (see configuration.md)
```

## Path Aliases

Path aliases are configured for cleaner imports and better code organization:

```typescript
// Instead of this:
import { Button } from '../../../components/ui/Button';

// Use this:
import { Button } from '@/components/ui/Button';
```

### Available Aliases

| Alias            | Path               | Description            |
| ---------------- | ------------------ | ---------------------- |
| `@/*`            | `src/*`            | All source files       |
| `@/components/*` | `src/components/*` | UI components          |
| `@/context/*`    | `src/context/*`    | Context providers      |
| `@/lib/*`        | `src/lib/*`        | Library configurations |
| `@/pages/*`      | `src/pages/*`      | Page components        |
| `@/types/*`      | `src/types/*`      | Type definitions       |
| `@/store/*`      | `src/store/*`      | State management       |
| `@/tests/*`      | `tests/*`          | Test files             |
| `@/utils/*`      | `src/utils/*`      | Utility functions      |

### Adding a New Path Alias

To add a new path alias, you need to update the TypeScript and Vite configurations:

1. Add the alias in `tsconfig.json` and `tsconfig.app.json`:

   ```json
   {
   	"compilerOptions": {
   		"paths": {
   			"@/newAlias/*": ["src/newPath/*"]
   		}
   	}
   }
   ```

2. Add it in `vite.config.ts`:
   ```typescript
   export default defineConfig({
   	resolve: {
   		alias: [
   			{
   				find: '@/newAlias',
   				replacement: resolve(__dirname, 'src/newPath'),
   			},
   		],
   	},
   });
   ```
