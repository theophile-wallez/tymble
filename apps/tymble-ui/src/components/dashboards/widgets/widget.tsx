import { forwardRef, type ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/ui/utils';

// Custom resize handle component
export const ResizeHandle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
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
));
ResizeHandle.displayName = 'ResizeHandle';

// Widget wrapper component for consistent styling
export const Widget = ({
  title,
  description,
  children,
  isEditing,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  isEditing?: boolean;
}) => (
  <Card
    className={cn(
      'relative size-full overflow-hidden',
      isEditing && 'cursor-move'
    )}
  >
    <CardHeader className="pb-2">
      <CardTitle className="font-medium text-sm">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex-1">{children}</CardContent>
    {isEditing && <div className="absolute inset-0 z-10 bg-transparent" />}
  </Card>
);
