import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { ButtonVite } from '@/components/ui/button-vite';
import { ShimmeringText } from '@/components/ui/shadcn-io/shimmering-text';

export function HeroSection() {
  return (
    <section className="relative md:pt-20" id="hero">
      <div className="relative container mx-auto max-w-screen-xl px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 tracking-tighter">
          <ShimmeringText
            text="Vite Powerflow"
            duration={2}
            color="var(--brand-primary)"
            shimmeringColor="var(--brand-primary-alt)"
            className="mr-2"
          />
          <span className="text-yellow-500"> ⚡</span>
        </h1>
        <h2 className="mb-10 max-w-3xl mx-auto font-semibold text-2xl text-neutral-500 dark:text-white">
          Skip days of setup and ship your React app fast. This starter kit includes TypeScript,
          testing, CI/CD, and development environment all configured with industry best practices.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonVite href="#getting-started" size="lg">
            Get Started
          </ButtonVite>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <FaGithub className="mr-2 h-5 w-5" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
