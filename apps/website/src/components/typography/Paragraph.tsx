import React from 'react';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: 'sm' | 'md' | 'lg';
};

export const Paragraph = ({ children, className = '', size = 'md', ...props }: ParagraphProps) => {
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'text-sm';
      break;
    case 'lg':
      sizeClass = 'text-lg font-medium';
      break;
    case 'md':
    default:
      sizeClass = 'text-base';
      break;
  }
  return (
    <p className={`text-gray-700 dark:text-white ${sizeClass} ${className}`} {...props}>
      {children}
    </p>
  );
};
