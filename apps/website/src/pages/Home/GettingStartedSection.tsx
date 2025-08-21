import { FaBook } from 'react-icons/fa';

import { ButtonVite } from '../../components/ui/button-vite';

import { CodeBlock } from '@/components/ui/code-block';

export function GettingStartedSection() {
  return (
    <section className="relative py-10 md:py-20 scroll-mt-20" id="getting-started">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <h2 className="font-semibold text-3xl md:text-4xl mb-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
            Get Started
          </h2>
          <p className="text-lg font-medium max-w-2xl mx-auto text-gray-500 dark:text-white">
            Our CLI tool lets you quickly scaffold a new React project with the Vite PowerFlow
            starter kit. Get started in seconds.
          </p>
        </div>

        {/* Quick Start Command */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <CodeBlock />
            <p className="text-sm font-medium text-muted-foreground text-center mt-2">
              Copy the command in your terminal and follow the CLI instructions.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonVite href="#getting-started" size="lg">
            Read the docs
            <FaBook className="translate-y-0" />
          </ButtonVite>
        </div>
      </div>
    </section>
  );
}
