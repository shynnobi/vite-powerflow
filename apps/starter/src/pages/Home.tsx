import type { ReactElement } from 'react';
import { FaGithub } from 'react-icons/fa';

import { Counter } from '../components/examples/Counter.js';

import { SEO } from '@/components/SEO';
import { ThemeToggle } from '@/components/themeToggle/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Home(): ReactElement {
  return (
    <>
      <SEO
        // TODO: Replace with your app's actual title (appears in browser tab)
        title="My App | A modern React starter kit"
        // TODO: Write a compelling description for search engines (160 chars max)
        description="A React + Vite starter, fully containerized for reproducible development, with strict code quality tools and AI-powered workflow. Includes comprehensive testing, linting, and CI/CD."
        // TODO: Add relevant keywords for your app's content and audience
        keywords="vite, react, typescript, starter kit, testing, ci/cd, dev containers, docker, tailwind css, shadcn/ui, storybook, vitest, playwright"
        isHomepage
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <nav className="absolute top-4 right-4 flex gap-2 items-center">
          <Button asChild variant="outline" className="text-lg">
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="flex flex-col items-center max-w-[760px] text-center gap-6">
          <h1 className="text-4xl font-bold text-blue-500 dark:text-yellow-200">
            Vite PowerFlow ⚡
          </h1>
          <p>
            A React + Vite starter, fully containerized for reproducible development, with strict
            code quality tools and AI-powered workflow. Includes comprehensive testing, linting, and
            CI/CD.
          </p>

          <Counter />
        </div>
      </div>
    </>
  );
}
