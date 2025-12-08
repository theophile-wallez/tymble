import { GripVertical } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/ui/utils';

type Props = PropsWithChildren<{
  title: string;
  description?: string;
  isEditing?: boolean;
  transparent?: boolean;
}>;

// Widget wrapper component for consistent styling
export const WidgetLayout = ({
  title,
  description,
  children,
  isEditing,
  transparent,
}: Props) => (
  <Card
    className={cn(
      'relative size-full overflow-hidden',
      transparent && 'border-transparent bg-background shadow-none',
      transparent && isEditing && 'border border-border border-dashed'
    )}
  >
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <CardTitle className="truncate font-medium text-sm">{title}</CardTitle>
        {description && (
          <CardDescription className="truncate text-xs">
            {description}
          </CardDescription>
        )}
      </div>
      {isEditing && (
        <div className="drag-handle absolute top-2 right-2 cursor-grab rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing">
          <GripVertical className="size-4" />
        </div>
      )}
    </CardHeader>
    <CardContent className="min-h-0 flex-1 overflow-auto">
      {children}
    </CardContent>
    {/* {isEditing && <div className="absolute inset-0 z-10 bg-transparent" />} */}
  </Card>
);
