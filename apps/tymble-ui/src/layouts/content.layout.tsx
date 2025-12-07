import type React from 'react';
import { cn } from '@/ui/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  cy?: string;
};

export const ContentLayout = ({ className, cy, ...props }: Props) => (
  <section
    {...props}
    className={cn('relative flex size-full flex-col', className)}
    data-cy={`content-layout-${cy}`}
    id={cy}
  />
);

export const ContentHeader = ({ className, cy, ...props }: Props) => (
  <header
    {...props}
    className={cn(
      'flex h-12 w-full items-center justify-between border-border border-b bg-accent px-6',
      className
    )}
    data-cy={`content-header-${cy}`}
  />
);

export const ContentTitle = ({ className, cy, ...props }: Props) => (
  <h1
    {...props}
    className={cn('font-normal text-base', className)}
    data-cy={`content-title-${cy}`}
  />
);
