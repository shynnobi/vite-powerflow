import React from 'react';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: 'sm' | 'md' | 'lg';
};

export const Paragraph = ({ children, className = '', size = 'md', ...props }: ParagraphProps) => {
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'text-sm md:text-medium';
      break;
    case 'lg':
      sizeClass = 'text-base md:text-lg';
      break;
    // Default is md
    default:
      sizeClass = 'text-medium md:text-base lg:text-md';
      break;
  }
  return (
    <p className={`text-gray-700 dark:text-white ${sizeClass} ${className}`} {...props}>
      {children}
    </p>
  );
};
