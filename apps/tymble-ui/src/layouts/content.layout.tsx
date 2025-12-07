import type React from 'react';
import { cn } from '@/ui/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  cy?: string;
};

export const ContentLayout = ({ className, cy, ...props }: Props) => (
  <section
    {...props}
    className={cn(
      'relative flex size-full flex-col overflow-hidden',
      className
    )}
    data-cy={`content-layout-${cy}`}
    id={cy}
  />
);

export const ContentHeader = ({ className, cy, ...props }: Props) => (
  <header
    {...props}
    className={cn(
      'flex h-12 w-full shrink-0 items-center justify-between border-border border-b bg-background px-6',
      className
    )}
    data-cy={`content-header-${cy}`}
  />
);

export const ContentSubHeader = ({ className, cy, ...props }: Props) => (
  <header
    {...props}
    className={cn(
      'justify-left flex h-12 w-full shrink-0 items-center border-border border-b bg-background px-6',
      className
    )}
    data-cy={`content-sub-header-${cy}`}
  />
);

export const ContentTitle = ({ className, cy, ...props }: Props) => (
  <h1
    {...props}
    className={cn('font-normal text-base', className)}
    data-cy={`content-title-${cy}`}
  />
);

export const ContentBody = ({ className, cy, ...props }: Props) => (
  <div
    {...props}
    className={cn('overflow-auto p-6', className)}
    data-cy={`content-body-${cy}`}
  />
);
