import type { ReactElement } from 'react';

import { Counter } from '@/components/examples/Counter';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
      <nav className="absolute top-4 right-4">
        <ThemeToggle />
      </nav>
      <h1 className="text-4xl font-bold font-heading mb-4">Vite PowerFlow ⚡</h1>
      <p className="mb-8 text-center max-w-3xl">
        A React + Vite starter, fully containerized for reproducible and collaborative development,
        with strict code quality tooling and AI pair programming workflow (Cursor rules). Includes
        comprehensive testing, linting, and CI/CD configurations following industry best practices.
      </p>
      <Counter />
    </div>
  );
}
