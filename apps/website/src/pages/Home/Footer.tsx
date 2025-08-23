import { FaArrowUp } from 'react-icons/fa';

import { Paragraph } from '@/components/typography/Paragraph';
import { Button } from '@/components/ui/button';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t pt-6 pb-10 md:pt-8 md:pb-20 px-6 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Open Source License */}
          <Paragraph size="sm" className="mb-4 md:mb-6">
            © {new Date().getFullYear()} Vite PowerFlow. Open source project licensed under{' '}
            <a
              href="https://github.com/shynnobi/vite-powerflow/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              MIT License
            </a>
            <br />
            Created with ❤️ by{' '}
            <a
              href="https://github.com/shynnobi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              shynnobi
            </a>
          </Paragraph>

          {/* Scroll to Top Button */}
          <Button
            variant="outline"
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <FaArrowUp />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}
