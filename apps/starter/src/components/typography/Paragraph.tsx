import React from 'react';

export const Paragraph = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`${className}`} {...props}>
    {children}
  </p>
);
