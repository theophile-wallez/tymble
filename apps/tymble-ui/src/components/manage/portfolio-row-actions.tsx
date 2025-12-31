import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
};

export const PortfolioRowActions = ({ portfolio, onDelete }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end py-2">
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
