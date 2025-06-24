import { type ReactElement } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ReactQueryProvider } from '@/lib/react-query/provider';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Home from '@/pages/Home';

export default function App(): ReactElement {
  return (
    <ReactQueryProvider>
      <>
        <nav className="fixed top-0 w-full bg-background p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex gap-4">
              <Link to="/" className="text-foreground hover:text-foreground/80">
                Home
              </Link>
              <Link to="/about" className="text-foreground hover:text-foreground/80">
                About
              </Link>
              <Link to="/blog" className="text-foreground hover:text-foreground/80">
                Blog
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </nav>
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
      </>
    </ReactQueryProvider>
  );
}
