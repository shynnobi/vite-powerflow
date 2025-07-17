import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Counter } from './Counter';

import { useCounterStore } from '@/store/counterStore';

const meta = {
  title: 'Examples/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

const CenteredWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--background)',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <CenteredWrapper>
      <Counter />
    </CenteredWrapper>
  ),
  play: async () => {
    useCounterStore.setState({ count: 0 });
  },
};

export const WithPositiveCount: Story = {
  render: () => (
    <CenteredWrapper>
      <Counter />
    </CenteredWrapper>
  ),
  play: async () => {
    useCounterStore.setState({ count: 5 });
  },
};

export const WithNegativeCount: Story = {
  render: () => (
    <CenteredWrapper>
      <Counter />
    </CenteredWrapper>
  ),
  play: async () => {
    useCounterStore.setState({ count: -3 });
  },
};
