import { type ReactElement } from 'react';

import { FAQSection } from './Home/FAQSection';
import { FeaturesSection } from './Home/FeaturesSection';
import { Footer } from './Home/Footer';
import { GetStartedSection } from './Home/GetStartedSection';
import { Header } from './Home/Header';
import { HeroSection } from './Home/HeroSection';

import { SEO } from '@/components/SEO';

export default function Home(): ReactElement {
  return (
    <>
      <SEO
        title="Vite PowerFlow | Next generation starter"
        description="Ultra-fast React development with TypeScript, testing, CI/CD workflows, and containerized development - all configured with industry best practices."
        keywords="vite, react, typescript, starter kit, testing, ci/cd, dev containers, docker, tailwind css, shadcn/ui, storybook, vitest, playwright"
        isHomepage
      />

      <div className="relative flex flex-col min-h-screen">
        <div className="absolute h-full w-full bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#c7c7c72e_1px,transparent_1px),linear-gradient(to_bottom,#d3d3d32e_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#23272f2e_1px,transparent_1px),linear-gradient(to_bottom,#23272f2e_1px,transparent_1px)]"></div>
        </div>

        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <GetStartedSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
