import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProviderContext } from '@/context/theme/ThemeContext';

const ThemeProvider = ({
  children,
  initialTheme = 'light',
}: {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      <div className={theme}>
        <div className="bg-background text-foreground">{children}</div>
      </div>
    </ThemeProviderContext.Provider>
  );
};

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A theme toggle button that switches between light and dark modes. The background changes to demonstrate the theme switch effect.',
      },
    },
  },
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightModeDefault: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--card)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="rounded-md bg-card p-4 text-card-foreground">
        <ThemeToggle />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  decorators: [
    Story => (
      <ThemeProvider initialTheme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--card)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="rounded-md bg-card p-4 text-card-foreground">
        <ThemeToggle />
      </div>
    </div>
  ),
};
