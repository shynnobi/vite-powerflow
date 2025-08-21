import { Paragraph } from '@/components/typography/Paragraph';

export function Footer() {
  return (
    <footer className="relative border-t pt-6 pb-10 md:pt-8 md:pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-screen-xl px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          {/* Open Source License */}
          <Paragraph size="sm" className="leading-loose">
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
        </div>
      </div>
    </footer>
  );
}
