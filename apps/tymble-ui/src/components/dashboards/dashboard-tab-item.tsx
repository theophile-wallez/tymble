import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/ui/utils';

export type DashboardTab = {
  id: string;
  name: string;
  emoji?: string;
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

  return (
    <div
      className={cn(
        'group relative flex shrink-0 cursor-pointer select-none items-center gap-1 rounded-sm px-3 py-1.5 text-sm backdrop-blur-md transition-colors',
        isActive
          ? 'border-border bg-accent text-foreground'
          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      data-cy={`dashboard-tab-item-${dashboard.id}`}
      onClick={onClick}
      onKeyUp={onClick}
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 1 : 1,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      {...attributes}
      {...listeners}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      <span className="truncate">
        {dashboard.emoji && <span className="mr-2">{dashboard.emoji}</span>}
        {dashboard.name}
      </span>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="-translate-y-1/2 absolute top-1/2 right-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
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
      </DropdownMenu> */}
    </div>
  );
};
