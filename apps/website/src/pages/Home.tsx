import type { ReactElement } from 'react';
import { FaGithub } from 'react-icons/fa';

import { ThemeToggle } from '@/components/themeToggle/ThemeToggle';
import { Button } from '@/components/ui/button';

function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm py-4 px-8 flex items-center justify-between">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">Vite PowerFlow ⚡</div>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <a
            href="#features"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white font-medium"
          >
            Features
          </a>
          <a
            href="#getting-started"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white font-medium"
          >
            Getting Started
          </a>
          <a
            href="https://github.com/shynnobi/vite-powerflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white font-medium"
          >
            <FaGithub className="mr-2 h-4 w-4" /> GitHub
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
}

export default function Home(): ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gray-900 flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16 bg-gray-100 dark:bg-gray-800">
        <h1 className="text-5xl font-extrabold mb-6 flex items-center justify-center gap-2 text-gray-900 dark:text-white drop-shadow-lg">
          Vite PowerFlow
          <span className="text-yellow-500 dark:text-yellow-400">⚡</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
          A React + Vite starter, containerized for reproducible and collaborative development.
          <br />
          Modern stack, strict code quality, CI/CD, testing, and developer tooling.
        </p>
        <div className="flex gap-6 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
          >
            <a href="#getting-started">Getting Started</a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border bg-background text-foreground dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900" id="features">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">
            ✨ Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="React + Vite + TypeScript"
              desc="Modern, fast, and type-safe stack."
            />
            <FeatureCard
              title="Tailwind CSS & shadcn/ui"
              desc="Rapid UI development, accessible and stylish components."
            />
            <FeatureCard
              title="Testing & Code Quality"
              desc="Vitest, Playwright, ESLint, Prettier, Husky."
            />
            <FeatureCard
              title="CI/CD & Dev Container"
              desc="GitHub Actions workflows, Docker, reproducible environments."
            />
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="getting-started">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🚀 Getting Started
          </h2>
          <p className="mb-8">
            Install Node.js, Docker, then run the CLI to generate your app.
            <br />
            <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded mt-4 font-mono text-gray-800 dark:text-white">
              npx @vite-powerflow/create my-app
            </span>
          </p>
          <Button size="lg" asChild>
            <a
              href="https://github.com/shynnobi/vite-powerflow#-quick-start"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full Documentation
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
