import React from 'react';

export const Blockquote = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <blockquote className={`mt-6 border-l-2 border-primary pl-6 italic ${className}`} {...props}>
    {children}
  </blockquote>
);
