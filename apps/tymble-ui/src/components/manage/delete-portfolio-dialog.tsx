import type { Portfolio } from '@/api/portfolios';
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

type DeletePortfolioDialogProps = {
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
}: DeletePortfolioDialogProps) => {
  return (
    <AlertDialog
      onOpenChange={(open: boolean) => !open && onClose()}
      open={!!portfolio}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete portfolio</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium">{portfolio?.name}</span>? This action
            cannot be undone. All associated transactions will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
