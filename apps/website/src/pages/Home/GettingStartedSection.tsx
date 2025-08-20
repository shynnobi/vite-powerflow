import { TerminalWindow } from '@/components/TerminalWindow';
import { CodeBlock } from '@/components/ui/code-block';

export function GettingStartedSection() {
  return (
    <section className="relative py-20 bg-secondary/50" id="getting-started">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Get Started in 3 minutes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your project in seconds, then simply "Reopen in Container" in your IDE to
            continue. No more environment setup, no more "works on my machine" issues.
          </p>
        </div>

        {/* Quick Start Command */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <CodeBlock title="Quick Start" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              Choose your package manager and copy the command to get started
            </p>
          </div>
        </div>

        {/* Terminal Showcase Section */}
        <div className="mb-16">
          <div className="space-y-6 max-w-2xl mx-auto">
            <TerminalWindow title="~/vite-powerflow" animated={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
