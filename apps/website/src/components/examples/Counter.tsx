import { type ReactElement } from 'react';
import { FiMinus, FiPlus, FiRefreshCw } from 'react-icons/fi';

import { useCounterStore } from '@/store/counterStore';

export function Counter(): ReactElement {
  const { count, increment, decrement, reset } = useCounterStore();

  const buttonClass = `
		rounded-md
		border
		bg-background
		text-foreground
		shadow-sm
		hover:bg-accent hover:text-accent-foreground
		transition
		focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
		p-2
		cursor-pointer
	`;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className={buttonClass}
        onClick={() => decrement()}
        data-testid="decrement-button"
        aria-label="Decrement counter"
      >
        <FiMinus className="h-5 w-5" aria-hidden="true" />
      </button>
      <code
        className="rounded-md border bg-card text-card-foreground shadow px-4 py-2 font-mono text-base"
        data-testid="counter-value"
      >
        count is {count}
      </code>
      <button
        type="button"
        className={buttonClass}
        onClick={() => increment()}
        data-testid="increment-button"
        aria-label="Increment counter"
      >
        <FiPlus className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => reset()}
        data-testid="reset-button"
        aria-label="Reset counter"
      >
        <FiRefreshCw className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
