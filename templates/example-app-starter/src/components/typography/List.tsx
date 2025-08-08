import React, { ReactNode } from 'react';

type ListType = 'ordered' | 'unordered';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  type?: ListType;
  children: ReactNode;
  className?: string;
}

export const List = ({ type = 'unordered', children, className = '', ...props }: ListProps) => {
  const Tag = type === 'ordered' ? 'ol' : 'ul';
  const baseClass =
    type === 'ordered' ? 'my-6 ml-6 list-decimal [&>li]:mt-2' : 'my-6 ml-6 list-disc [&>li]:mt-2';

  return React.createElement(Tag, { className: `${baseClass} ${className}`, ...props }, children);
};
