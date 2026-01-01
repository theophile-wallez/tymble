import { DragDropVerticalIcon } from '@hugeicons/core-free-icons';
import { Icon } from '@/ui/icon';
import { AnimatePresence, motion } from 'motion/react';
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
  title?: string;
  description?: string;
  isEditing?: boolean;
  transparent?: boolean;
  className?: string;
  cardClassName?: string;
}>;

// Widget wrapper component for consistent styling
export const WidgetLayout = ({
  title,
  description,
  children,
  isEditing,
  transparent,
  className,
  cardClassName,
}: Props) => (
  <Card
    className={cn(
      'relative z-10 size-full overflow-hidden',
      transparent && 'border-transparent bg-background shadow-none',
      transparent && isEditing && 'border border-border border-dashed',
      className
    )}
  >
    {title && (
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <CardTitle className="truncate font-medium text-sm">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="truncate text-xs">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
    )}
    <AnimatePresence>
      {isEditing && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="drag-handle absolute top-2 right-2 cursor-grab rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Icon icon={DragDropVerticalIcon} className="size-4" />
        </motion.div>
      )}
    </AnimatePresence>
    <CardContent
      className={cn('mx-1 min-h-0 flex-1 overflow-auto px-5', cardClassName)}
    >
      {children}
    </CardContent>
    {/* {isEditing && <div className="absolute inset-0 z-10 bg-transparent" />} */}
  </Card>
);
