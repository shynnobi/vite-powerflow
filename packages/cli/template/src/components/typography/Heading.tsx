import React, { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML tag to use (h1 to h6) */
  as?: HeadingLevel;
  /** Visual size (h1 to h6) */
  size?: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const headingStyleMap: Record<HeadingLevel, React.CSSProperties> = {
  h1: { fontSize: '3.6rem', lineHeight: 1.1 },
  h2: { fontSize: '3rem', lineHeight: 1.1 },
  h3: { fontSize: '2.4rem', lineHeight: 1.2 },
  h4: { fontSize: '2rem', lineHeight: 1.2 },
  h5: { fontSize: '1.6rem', lineHeight: 1.3 },
  h6: { fontSize: '1.2rem', lineHeight: 1.3 },
};

export const Heading: React.FC<HeadingProps> = ({
  as = 'h1',
  size,
  children,
  className = '',
  style,
  ...props
}) => {
  const visualSize = size ?? as;
  return React.createElement(
    as,
    {
      className: `font-heading font-bold ${className}`,
      style: { ...headingStyleMap[visualSize], ...style },
      ...props,
    },
    children
  );
};
