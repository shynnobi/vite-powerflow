import React, { ReactNode } from 'react';

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  className?: string;
}

export const ListItem = ({ children, className = '', ...props }: ListItemProps) => (
  <li className={className} {...props}>
    {children}
  </li>
);
