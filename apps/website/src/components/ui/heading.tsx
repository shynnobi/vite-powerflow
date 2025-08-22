import * as React from 'react';

import { cn } from '@/lib/utils';

// Common styles shared by all headings
const commonHeadingStyles = 'font-heading text-gray-700 dark:text-white';

// Level-specific styles for each heading
const headingStyles = {
  h1: 'text-3xl md:text-5xl font-extrabold',
  h2: 'text-2xl md:text-3xl font-medium mb-4 md:mb-6',
  h3: 'text-xl md:text-2xl font-bold',
  h4: 'text-lg md:text-xl font-bold',
  h5: 'text-base md:text-lg font-semibold',
  h6: 'text-sm md:text-base font-medium',
} as const;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = 'h2', size, children, ...props }, ref) => {
    const Component = as;
    const visualLevel = size || as;
    const levelStyles =
      headingStyles[visualLevel as keyof typeof headingStyles] || headingStyles.h2;

    // Combine common styles + level-specific styles + custom className
    const baseStyles = cn(commonHeadingStyles, levelStyles, className);

    return (
      <Component className={baseStyles} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
