/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Settings, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { cn } from '@/ui/utils';

export type DashboardTab = {
  id: string;
  name: string;
};

type Props = {
  dashboard: DashboardTab;
  isActive: boolean;
  onClick: () => void;
};

export const SortableDashboardTabItem = ({
  dashboard,
  isActive,
  onClick,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dashboard.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      className={cn(
        'group flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      onClick={onClick}
      onKeyUp={onClick}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="truncate">{dashboard.name}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              // Prevent drag when clicking the menu
            }}
            onPointerDown={(e) => {
              // Stop propagation to prevent drag start
              e.stopPropagation();
            }}
            type="button"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" />
            Edit Dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
