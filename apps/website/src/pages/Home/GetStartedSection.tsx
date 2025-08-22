import { FaBook } from 'react-icons/fa';

import { Paragraph } from '../../components/typography/Paragraph';
import { ButtonVite } from '../../components/ui/button-vite';

import { CodeBlock } from '@/components/ui/code-block';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';

export function GetStartedSection() {
  return (
    <Container className="scroll-mt-32" id="getting-started">
      <div className="">
        <div className="text-left md:text-center mb-6 md:mb-10 max-w-2xl mx-auto">
          <Heading
            as="h2"
            // className="bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent"
          >
            Ready to Start? 🚀
          </Heading>
          <Paragraph
            size="lg"
            className="text-left md:text-center md:max-w-xl lg:max-w-2xl mx-auto font-medium"
          >
            Use the command below to create a new project with the Vite PowerFlow CLI. You&apos;ll
            get a complete, production-ready setup in under two minutes, letting you focus on
            building your app, not on configuration.
          </Paragraph>
        </div>

        {/* Quick Start Command */}
        <div className="mb-6 md:mb-10">
          <div className="max-w-2xl mx-auto">
            <CodeBlock />
            <Paragraph size="sm" className="font-medium text-center mt-2">
              Copy the command in your terminal and follow the CLI instructions.
            </Paragraph>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonVite href="#getting-started" size="lg">
            Read the docs
            <FaBook className="translate-y-0" />
          </ButtonVite>
        </div>
      </div>
    </Container>
  );
}
