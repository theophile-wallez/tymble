import { useEffect, useState } from 'react';
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
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

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
  const [confirmationText, setConfirmationText] = useState('');

  const isConfirmationValid = confirmationText === portfolio?.name;

  // Reset confirmation text when dialog opens/closes
  useEffect(() => {
    if (!portfolio) {
      setConfirmationText('');
    }
  }, [portfolio]);

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  return (
    <AlertDialog
      onOpenChange={(open: boolean) => !open && handleClose()}
      open={!!portfolio}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('manage.deleteDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                {t('manage.deleteDialog.description')
                  .split('{{name}}')
                  .map((part, index, array) =>
                    index < array.length - 1 ? (
                      <span key={`part-${part.slice(0, 10)}`}>
                        {part}
                        <span className="pointer-events-none select-none font-semibold text-foreground">
                          {portfolio?.name}
                        </span>
                      </span>
                    ) : (
                      part
                    )
                  )}
              </p>
              <div className="space-y-2">
                <Label htmlFor="confirm-name">
                  {t('manage.deleteDialog.confirmLabel')}
                </Label>
                <Input
                  autoComplete="off"
                  id="confirm-name"
                  onChange={(e) => setConfirmationText(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  placeholder={portfolio?.name}
                  value={confirmationText}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('manage.deleteDialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isDeleting || !isConfirmationValid}
            onClick={onConfirm}
          >
            {isDeleting
              ? t('common.loading')
              : t('manage.deleteDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
