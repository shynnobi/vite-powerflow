import { useState } from 'react';
import { FaTerminal } from 'react-icons/fa';

import { CopyButton } from './shadcn-io/copy-button';
import { Tabs, TabsList, TabsTrigger } from './tabs';

import { cn } from '@/lib/utils';

interface CodeBlockProps {
  className?: string;
  title?: string;
}

const packageManagers = [
  {
    id: 'npm',
    label: 'npm',
    command: 'npx @vite-powerflow/create',
    icon: '/images/package-manager-logos/npm.svg',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: 'pnpm dlx @vite-powerflow/create',
    icon: '/images/package-manager-logos/pnpm.svg',
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: 'yarn dlx @vite-powerflow/create',
    icon: '/images/package-manager-logos/yarn.svg',
  },
  {
    id: 'bun',
    label: 'bun',
    command: 'bunx @vite-powerflow/create',
    icon: '/images/package-manager-logos/bun.svg',
  },
];

export function CodeBlock({ className }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState('pnpm');

  const activeCommand = packageManagers.find(pm => pm.id === activeTab)?.command || '';

  return (
    <div className={cn('w-full', className)}>
      {/* Code block with tabs - Inverted theme */}
      <div className="bg-gray-900 dark:bg-white rounded-lg">
        {/* Package manager tabs */}
        <div className="flex items-center gap-1 px-2 border-b border-gray-700 dark:border-gray-200">
          <div className="text-gray-400 dark:text-gray-600">
            <FaTerminal className="mx-2" />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="rounded-none bg-transparent dark:bg-gray-100 p-0">
              {packageManagers.map(pm => (
                <TabsTrigger
                  key={pm.id}
                  value={pm.id}
                  className="px-2 text-xs border-0 rounded-none data-[state=active]:bg-gray-800 dark:data-[state=active]:shadow-none data-[state=active]:border-b-3 data-[state=active]:border-b-blue-500 text-gray-300 dark:text-gray-700 data-[state=active]:text-white dark:data-[state=active]:text-gray-900 dark:data-[state=active]:border-b-3 dark:data-[state=active]:border-b-blue-500 dark:data-[state=active]:bg-gray-100 dark:bg-white flex items-center gap-1.5 cursor-pointer"
                >
                  <img src={pm.icon} alt={pm.label} className="w-3 h-3" />
                  {pm.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Command display */}
        <div className="p-3 flex items-center gap-2 justify-between">
          <code className="text-sm font-mono text-white dark:text-gray-900">
            <span className="text-green-400">$</span> {activeCommand}
          </code>
          <CopyButton
            content={activeCommand}
            variant="ghost"
            className="border border-gray-700 dark:border-gray-300 bg-gray-700 dark:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-200 text-gray-400 dark:text-gray-600 hover:text-gray-200 dark:hover:text-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
