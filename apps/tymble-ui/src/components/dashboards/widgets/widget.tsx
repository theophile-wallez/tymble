import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

// Custom resize handle component
const ResizeHandle = () => (
  <div className="react-resizable-handle absolute right-1 bottom-1 z-20 size-3 cursor-se-resize rounded-br-full border-muted-foreground border-r-2 border-b-2 transition-colors hover:border-foreground" />
);

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
  <Card className="relative size-full overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="font-medium text-sm">{title}</CardTitle>
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="flex-1">{children}</CardContent>
    {isEditing && <ResizeHandle />}
  </Card>
);
