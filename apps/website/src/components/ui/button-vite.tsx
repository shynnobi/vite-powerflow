import React from 'react';

import { cn } from '@/lib/utils';

interface ButtonViteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const ButtonVite = React.forwardRef<HTMLButtonElement, ButtonViteProps>(
  ({ className, children, href, size = 'default', ...props }, ref) => {
    const buttonClasses = cn(
      // Base styles
      'relative inline-flex items-center justify-center gap-2',
      'rounded-full border-0 cursor-pointer',
      'font-inter font-semibold text-white',
      'transition-transform duration-300 ease-out',
      'bg-gradient-to-br from-[var(--brand-primary-light)] via-[var(--brand-primary)] to-[var(--brand-primary-dark)]',
      'dark:from-[var(--brand-primary-light)] dark:via-[var(--brand-primary)] dark:to-[var(--brand-primary-dark)]',
      'hover:translate-y-[-2px] hover:from-[var(--brand-primary-lighter)] hover:via-[var(--brand-primary)] hover:to-[var(--brand-primary)]',
      'hover:dark:from-[var(--brand-primary-light)] hover:dark:via-[var(--brand-primary-dark)] hover:dark:to-[var(--brand-primary-dark)]',
      'active:translate-y-[-1px]',

      // Size variants (aligned with shadcn/ui Button)
      {
        'h-9 px-4 py-2 text-sm': size === 'default',
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-6 text-sm': size === 'lg',
      },

      className
    );

    const buttonContent = (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonContent}
        </a>
      );
    }

    return buttonContent;
  }
);

ButtonVite.displayName = 'ButtonVite';

export { ButtonVite };
