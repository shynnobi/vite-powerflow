import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[background,color] duration-200 ease-in-out font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        primary:
          'bg-gradient-to-br from-cyan-100/50 to-blue-200 text-blue-600 dark:from-blue-400/20 dark:to-blue-300/20 dark:text-white',
        yellow:
          'bg-gradient-to-br from-yellow-100/50 to-orange-200 text-orange-600 dark:from-orange-400/20 dark:to-orange-300/20 dark:text-white',
        magenta:
          'bg-gradient-to-br from-pink-100/50 to-purple-200 text-purple-600 dark:from-purple-400/20 dark:to-purple-300/20 dark:text-white',
        rose: 'bg-gradient-to-br from-rose-100/50 to-pink-200 text-rose-600 dark:from-rose-400/20 dark:to-rose-300/20 dark:text-white',
        orange:
          'bg-gradient-to-br from-orange-100/50 to-red-200 text-orange-600 dark:from-orange-400/20 dark:to-orange-300/20 dark:text-white',
        green:
          'bg-gradient-to-br from-green-100/50 to-emerald-200 text-green-600 dark:from-green-400/20 dark:to-green-300/20 dark:text-white',
        purple:
          'bg-gradient-to-br from-violet-100/50 to-purple-200 text-violet-600 dark:from-violet-400/20 dark:to-violet-300/20 dark:text-white',
        turquoise:
          'bg-gradient-to-br from-teal-100/50 to-cyan-200 text-teal-600 dark:from-teal-400/20 dark:to-teal-300/20 dark:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
