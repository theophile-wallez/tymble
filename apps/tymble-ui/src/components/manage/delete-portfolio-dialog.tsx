import type { Portfolio } from '@/api/portfolios';
import { useTranslation } from '@/hooks/use-translation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';

type Props = {
  portfolio: Portfolio | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeletePortfolioDialog = ({
  portfolio,
  isDeleting,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AlertDialog
      onOpenChange={(open: boolean) => !open && onClose()}
      open={!!portfolio}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('manage.deleteDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('manage.deleteDialog.description').replace(
              '{{name}}',
              portfolio?.name ?? ''
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('manage.deleteDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? t('common.loading') : t('manage.deleteDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
