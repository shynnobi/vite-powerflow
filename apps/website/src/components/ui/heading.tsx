import * as React from 'react';

import { cn } from '@/lib/utils';

// Common styles shared by all headings
const commonHeadingStyles = 'font-heading';

// Level-specific styles for each heading
const headingStyles = {
  h1: 'text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground',
  h2: 'text-lg md:text-xl font-medium text-gray-500 dark:text-white',
  h3: 'text-base md:text-xl font-bold text-foreground',
} as const;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = 'h2', children, ...props }, ref) => {
    const Component = as;
    const levelStyles = headingStyles[as as keyof typeof headingStyles] || headingStyles.h2;

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

// Specialized heading components with hard-coded styles
const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>((props, ref) => (
  <Heading ref={ref} as="h1" {...props} />
));
H1.displayName = 'H1';

const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>((props, ref) => (
  <Heading ref={ref} as="h2" {...props} />
));
H2.displayName = 'H2';

const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'as'>>((props, ref) => (
  <Heading ref={ref} as="h3" {...props} />
));
H3.displayName = 'H3';

export { H1, H2, H3, Heading };
