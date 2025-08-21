import { FaArrowDown, FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { ButtonVite } from '@/components/ui/button-vite';
import { Heading } from '@/components/ui/heading';
import { ShimmeringText } from '@/components/ui/shadcn-io/shimmering-text';

export function HeroSection() {
  return (
    <section className="relative pt-10 md:pt-16" id="hero">
      <div className="relative container mx-auto max-w-screen-xl px-6 text-center">
        <Heading as="h1" className="mb-2 md:mb-5 tracking-tighter">
          <ShimmeringText
            text="Vite PowerFlow"
            duration={2}
            color="var(--brand-primary)"
            shimmeringColor="var(--brand-primary-alt)"
            className="mr-2"
          />
          <span className="text-yellow-500"> ⚡</span>
        </Heading>
        <Heading
          as="h2"
          size="h4"
          className="mb-4 md:mb-8 max-w-2xl mx-auto text-center font-semibold text-gray-600 dark:text-white"
        >
          <span className="font-bold text-gray-700 dark:text-white">
            Skip days of setup and ship your React app fast.
          </span>
          <br className="hidden md:inline-block" /> This starter kit includes TypeScript, testing,
          CI/CD workflows, and containerized development - all configured with industry best
          practices.
        </Heading>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonVite href="#getting-started" size="lg">
            Get Started
            <FaArrowDown className="translate-y-0 bounce-arrow" />
          </ButtonVite>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/shynnobi/vite-powerflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              View on GitHub
              <FaGithub className="text-gray-700 translate-y-0 dark:text-white" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
