import { FaGithub } from 'react-icons/fa';

import { ThemeToggle } from '@/components/themeToggle/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg">
      <div className="container mx-auto flex py-3 max-w-screen-xl items-center justify-between px-6">
        <div className="text-xl font-bold">
          <a href="/" className="flex items-center gap-2 text-gray-400">
            Vite Powerflow
          </a>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-5 text-sm font-semibold text-gray-500 dark:text-gray-200">
            <a href="#hero" className="">
              Docs
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-foreground/60 hover:text-foreground/80"
            >
              <FaGithub className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
