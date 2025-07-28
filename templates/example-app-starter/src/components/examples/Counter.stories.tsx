import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Counter } from './Counter.js';

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

// Wrapper component that properly handles state initialization
const CounterWithInitialState: React.FC<{ initialCount: number }> = ({ initialCount }) => {
  // Initialize state directly without useEffect
  React.useMemo(() => {
    useCounterStore.setState({ count: initialCount });
  }, [initialCount]);

  return <Counter />;
};

export const Default: Story = {
  render: () => <CounterWithInitialState initialCount={0} />,
};

export const WithPositiveCount: Story = {
  render: () => <CounterWithInitialState initialCount={5} />,
};

export const WithNegativeCount: Story = {
  render: () => <CounterWithInitialState initialCount={-3} />,
};
