import type { ReactElement } from 'react';

import { FAQSection } from './Home/FAQSection';
import { FeaturesSection } from './Home/FeaturesSection';
import { Footer } from './Home/Footer';
import { GettingStartedSection } from './Home/GettingStartedSection';
import { Header } from './Home/Header';
import { HeroSection } from './Home/HeroSection';

export default function Home(): ReactElement {
  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="absolute h-full w-full bg-neutral-50 dark:bg-neutral-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#c7c7c72e_1px,transparent_1px),linear-gradient(to_bottom,#d3d3d32e_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#23272f2e_1px,transparent_1px),linear-gradient(to_bottom,#23272f2e_1px,transparent_1px)]"></div>
      </div>

      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <GettingStartedSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
