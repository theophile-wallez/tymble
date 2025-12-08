import { cn } from '@/ui/utils';

// Custom resize handle component
export const ResizeHandle = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <div
    className={cn(
      'react-resizable-handle group/handle absolute right-0 bottom-0 z-20 size-6 cursor-se-resize',
      className
    )}
    ref={ref}
    {...props}
  >
    <div className="absolute right-1 bottom-1 size-3 rounded-br-full border-muted-foreground border-r-2 border-b-2 transition-colors group-hover/handle:border-foreground" />
  </div>
);
ResizeHandle.displayName = 'ResizeHandle';
