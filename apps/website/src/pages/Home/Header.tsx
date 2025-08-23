import { FaGithub } from 'react-icons/fa';

import { ThemeToggle } from '@/components/themeToggle/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg">
      <div className="container mx-auto flex py-3 max-w-screen-xl items-center justify-between px-6">
        <div className="text-xl font-extrabold font-heading italic tracking-tight">
          <a
            href="/"
            className="bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent"
          >
            Vite PowerFlow
            <span className="text-yellow-500"> ⚡</span>
          </a>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-5 text-sm font-semibold text-gray-700 dark:text-white">
            {/* <a href="#hero" className="">
              Docs
            </a> */}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 dark:text-white"
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
