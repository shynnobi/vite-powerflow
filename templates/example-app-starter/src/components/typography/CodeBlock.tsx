import React from 'react';

export const CodeBlock = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <code
    className={`relative rounded bg-gray-900 text-white p-3 font-mono text-sm font-semibold block mt-6 ${className}`}
    {...props}
  >
    {children}
  </code>
);
