import type React from 'react';
import { cn } from '@/ui/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  pageId?: string;
};

export const ContentLayout = ({ className, pageId, ...props }: Props) => (
  <section
    {...props}
    className={cn('flex size-full flex-col', className)}
    data-cy={`content-layout-${pageId}`}
    id={pageId}
  />
);
