import * as React from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends React.ComponentPropsWithoutRef<'section'> {
  as?: 'section' | 'div' | 'main' | 'article';
}

const Container = ({
  className,
  as: Component = 'section',
  children,
  ...props
}: ContainerProps) => {
  return (
    <Component
      className={cn('relative pb-12 md:pb-24 xl:pb-32 px-4 md:px-6', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

Container.displayName = 'Container';

export { Container };
