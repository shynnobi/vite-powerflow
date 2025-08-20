import { FaBrain, FaRocket, FaShieldAlt, FaSyncAlt } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export function AiPoweredSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-screen-lg px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Development</h2>
            <p className="text-muted-foreground mb-6">
              Optimized for Cursor AI, this starter includes pre-configured rules to enhance code
              generation and assistance, ensuring the AI understands your project's context and best
              practices.
            </p>
            <Button asChild>
              <a
                href="https://github.com/shynnobi/vite-powerflow/tree/main/.cursor/rules"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore AI Rules
              </a>
            </Button>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center text-primary mb-4">
              <FaBrain className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-semibold">Enhanced Workflow</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <FaShieldAlt className="w-4 h-4 mr-3 mt-1 text-primary/70" />
                <span>
                  <strong>Code Standards:</strong> Enforces TypeScript, React, and naming
                  conventions.
                </span>
              </li>
              <li className="flex items-start">
                <FaRocket className="w-4 h-4 mr-3 mt-1 text-primary/70" />
                <span>
                  <strong>Best Practices:</strong> Guides the AI to follow TDD, atomic commits, and
                  SoC.
                </span>
              </li>
              <li className="flex items-start">
                <FaSyncAlt className="w-4 h-4 mr-3 mt-1 text-primary/70" />
                <span>
                  <strong>Consistency:</strong> Aligns AI suggestions with your project's
                  architecture.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
