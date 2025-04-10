# Development Guide

This guide covers development practices and workflows for Vite PowerFlow projects.

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Testing
pnpm test         # Run all tests
pnpm test:unit    # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm test:coverage # Generate test coverage report

# Linting & Formatting
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format code with Prettier

# Storybook
pnpm storybook    # Start Storybook
pnpm build-storybook # Build Storybook
```

## Development Workflow

### 1. Branch Management

We follow a simplified Git Flow:

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Release branches: `release/v1.x.x`

### 2. Commit Messages

We use conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

Example:

```
feat(auth): add social login buttons

- Add Google login button
- Add GitHub login button
- Add styling for social buttons

Closes #123
```

### 3. Code Review Process

1. Create a pull request
2. Request reviews from team members
3. Address feedback
4. Merge when approved

## Component Development

### 1. Component Structure

```typescript
// src/components/Button/Button.tsx
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-medium transition-colors',
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary/90': variant === 'secondary',
            'border border-input bg-background hover:bg-accent': variant === 'outline',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-11 px-6': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

### 2. Component Testing

```typescript
// src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies variant classes', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })
})
```

### 3. Component Documentation

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: 'Button',
		variant: 'primary',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Button',
		variant: 'secondary',
	},
};

export const Outline: Story = {
	args: {
		children: 'Button',
		variant: 'outline',
	},
};
```

## State Management

### 1. Local State

Use React's built-in state management for component-local state:

```typescript
const [count, setCount] = useState(0);
```

### 2. Global State

Use Zustand for global state management:

```typescript
// src/stores/useCounterStore.ts
import { create } from 'zustand';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
}

export const useCounterStore = create<CounterState>(set => ({
	count: 0,
	increment: () => set(state => ({ count: state.count + 1 })),
	decrement: () => set(state => ({ count: state.count - 1 })),
}));
```

## API Integration

### 1. API Client Setup

```typescript
// src/lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
```

### 2. API Hooks

```typescript
// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface User {
	id: number;
	name: string;
	email: string;
}

export const useUsers = () => {
	const queryClient = useQueryClient();

	const { data: users, isLoading } = useQuery<User[]>({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await apiClient.get('/users');
			return data;
		},
	});

	const createUser = useMutation({
		mutationFn: async (user: Omit<User, 'id'>) => {
			const { data } = await apiClient.post('/users', user);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});

	return {
		users,
		isLoading,
		createUser,
	};
};
```

## Styling

### 1. Tailwind CSS

Use Tailwind CSS for styling:

```typescript
// Example component with Tailwind classes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border bg-card p-6 shadow-sm">
    {children}
  </div>
)
```

### 2. CSS Modules

For component-specific styles:

```css
/* Button.module.css */
.button {
	/* styles */
}

.primary {
	/* styles */
}

.secondary {
	/* styles */
}
```

```typescript
import styles from './Button.module.css'

const Button = ({ variant = 'primary' }) => (
  <button className={`${styles.button} ${styles[variant]}`}>
    Click me
  </button>
)
```

## Performance Optimization

### 1. Code Splitting

Use dynamic imports for code splitting:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 2. Memoization

Use React's memoization hooks:

```typescript
const MemoizedComponent = memo(({ data }) => {
	// Component logic
});

const expensiveValue = useMemo(() => {
	// Expensive computation
}, [dependencies]);

const memoizedCallback = useCallback(() => {
	// Callback logic
}, [dependencies]);
```

## Error Handling

### 1. Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button
              className="mt-4 rounded-md bg-primary px-4 py-2 text-white"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. API Error Handling

```typescript
// src/lib/api-error.ts
export class ApiError extends Error {
	constructor(
		public status: number,
		public message: string,
		public data?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}

// Usage in API client
apiClient.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			throw new ApiError(error.response.status, error.response.data.message, error.response.data);
		}
		throw error;
	}
);
```

## Testing

### 1. Unit Testing

```typescript
// Example test
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### 2. Integration Testing

```typescript
// Example integration test
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('submits form with correct data', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

### 3. E2E Testing

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
	await page.goto('/login');
	await page.fill('[data-testid="email"]', 'test@example.com');
	await page.fill('[data-testid="password"]', 'password123');
	await page.click('[data-testid="submit"]');
	await expect(page).toHaveURL('/dashboard');
});
```

## Debugging

### 1. React DevTools

Install React Developer Tools browser extension for debugging React components.

### 2. VS Code Debugging

Add launch configuration in `.vscode/launch.json`:

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "chrome",
			"request": "launch",
			"name": "Launch Chrome against localhost",
			"url": "http://localhost:5173",
			"webRoot": "${workspaceFolder}"
		}
	]
}
```

## Best Practices

1. **Code Organization**

   - Keep components small and focused
   - Use feature-based folder structure
   - Follow consistent naming conventions

2. **Performance**

   - Use React.memo for expensive components
   - Implement proper code splitting
   - Optimize images and assets

3. **Security**

   - Sanitize user input
   - Use HTTPS
   - Implement proper authentication
   - Follow security best practices

4. **Accessibility**

   - Use semantic HTML
   - Add proper ARIA attributes
   - Ensure keyboard navigation
   - Test with screen readers

5. **Testing**
   - Write tests for all components
   - Maintain good test coverage
   - Use meaningful test descriptions
   - Follow testing best practices

## Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For type checking
- **Vitest**: For unit testing
- **Playwright**: For E2E testing
- **Husky**: For Git hooks
- **lint-staged**: For running linters on staged files

## Pre-commit Hooks

The following checks run automatically before each commit:

- TypeScript type checking
- ESLint
- Prettier formatting
- Unit tests

## VS Code Integration

This project includes VS Code settings for the best development experience:

- Recommended extensions
- Debug configurations
- Task configurations
- Editor settings

To get the best experience, install the recommended extensions when prompted by VS Code.
