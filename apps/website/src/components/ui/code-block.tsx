import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

interface CodeBlockProps {
  className?: string;
  title?: string;
}

const packageManagers = [
  { id: 'pnpm', label: 'pnpm', command: 'pnpm dlx @vite-powerflow/create my-app' },
  { id: 'npm', label: 'npm', command: 'npx @vite-powerflow/create my-app' },
  { id: 'yarn', label: 'yarn', command: 'yarn dlx @vite-powerflow/create my-app' },
  { id: 'bun', label: 'bun', command: 'bunx @vite-powerflow/create my-app' },
];

export function CodeBlock({ className, title = 'CLI Manual' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pnpm');

  const copyToClipboard = async (text: string) => {
    try {
      await window.navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCommand = packageManagers.find(pm => pm.id === activeTab)?.command || '';

  return (
    <div className={cn('w-full', className)}>
      {/* Header with title and copy button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <button
          onClick={() => copyToClipboard(activeCommand)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
          title="Copy to clipboard"
        >
          {copied ? <FaCheck className="w-3 h-3 text-green-500" /> : <FaCopy className="w-3 h-3" />}
        </button>
      </div>

      {/* Code block with tabs */}
      <div className="bg-muted rounded-lg border">
        {/* Package manager tabs */}
        <div className="flex items-center gap-1 p-3 border-b">
          <div className="text-muted-foreground mr-2">$</div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-7 bg-background border">
              {packageManagers.map(pm => (
                <TabsTrigger
                  key={pm.id}
                  value={pm.id}
                  className="h-6 px-2 text-xs data-[state=active]:bg-muted"
                >
                  {pm.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Command display */}
        <div className="p-3">
          <code className="text-sm font-mono text-foreground">{activeCommand}</code>
        </div>
      </div>
    </div>
  );
}
