import {
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Settings,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Portfolio } from '@/api/portfolios';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

type Props = {
  portfolio: Portfolio;
  onDelete: (e: React.MouseEvent, portfolio: Portfolio) => void;
  onManage?: (e: React.MouseEvent, portfolio: Portfolio) => void;
};

export const PortfolioRowActions = ({
  portfolio,
  onDelete,
  onManage,
}: Props) => {
  const { t } = useTranslation();

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
        {t('manage.table.manage')}
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
            {t('manage.table.addAsset')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit
              toast.info('Edit coming soon!');
            }}
          >
            <Pencil className="size-4" />
            {t('manage.table.edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => onDelete(e, portfolio)}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            {t('manage.table.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
