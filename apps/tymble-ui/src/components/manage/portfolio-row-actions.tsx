import {
  Delete01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import type { PortfolioWithSimpleRelations } from '@tymble/schemas';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Icon } from '@/ui/icon';

type Props = {
  portfolio: PortfolioWithSimpleRelations;
  onDelete: (
    e: React.MouseEvent,
    portfolio: PortfolioWithSimpleRelations
  ) => void;
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
            <Icon className="size-4" icon={MoreHorizontalIcon} />
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
            <Icon className="size-4" icon={PencilEdit01Icon} />
            {t('manage.table.edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => onDelete(e, portfolio)}
            variant="destructive"
          >
            <Icon className="size-4" icon={Delete01Icon} />
            {t('manage.table.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
