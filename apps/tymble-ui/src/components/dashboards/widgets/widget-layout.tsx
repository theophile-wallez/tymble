import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/ui/utils';

// Widget wrapper component for consistent styling
export const WidgetLayout = ({
  title,
  description,
  children,
  isEditing,
  transparent,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  isEditing?: boolean;
  transparent?: boolean;
}) => (
  <Card
    className={cn(
      'relative size-full overflow-hidden',
      isEditing && 'cursor-move',
      transparent && 'border-transparent bg-background shadow-none',
      transparent && isEditing && 'border border-border border-dashed'
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
