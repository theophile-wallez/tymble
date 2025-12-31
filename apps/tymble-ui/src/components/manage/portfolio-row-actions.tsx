import {
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Settings,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Portfolio } from '@/api/portfolios';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

type PortfolioRowActionsProps = {
  portfolio: Portfolio;
  onDelete: (e: React.MouseEvent, portfolio: Portfolio) => void;
  onManage?: (e: React.MouseEvent, portfolio: Portfolio) => void;
};

export const PortfolioRowActions = ({
  portfolio,
  onDelete,
  onManage,
}: PortfolioRowActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1 py-2">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onManage?.(e, portfolio);
        }}
        size="sm"
        variant="outline"
      >
        <Settings className="size-4" />
        Manage
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            size="icon-sm"
            variant="ghost"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement add asset
              toast.info('Add asset coming soon!');
            }}
          >
            <PlusCircle className="size-4" />
            Add asset
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit
              toast.info('Edit coming soon!');
            }}
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => onDelete(e, portfolio)}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
