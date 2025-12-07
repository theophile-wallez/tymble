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
    data-content-layout
    data-cy={`content-layout-${cy}`}
    id={cy}
  />
);

export const ContentHeader = ({ className, cy, ...props }: Props) => (
  <header
    {...props}
    className={cn(
      'absolute top-0 left-0 flex h-content-header w-full items-center justify-between border-border border-b bg-background/80 px-6 backdrop-blur-md',
      className
    )}
    data-content-header
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

export const ContentBody = ({ className, cy, ...props }: Props) => (
  <div
    {...props}
    className={cn(
      'overflow-auto p-6 [[data-content-header]~&]:pt-content-header',
      className
    )}
    data-content-body
    data-cy={`content-body-${cy}`}
  />
);
