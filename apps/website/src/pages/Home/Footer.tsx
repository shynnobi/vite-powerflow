export function Footer() {
  return (
    <footer className="relative border-t py-6 md:py-12 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-screen-xl px-6">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vite PowerFlow. All rights reserved.
          </p>

          {/* Author Credits */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Created with ❤️ by{' '}
              <a
                href="https://github.com/shynnobi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                shynnobi
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
