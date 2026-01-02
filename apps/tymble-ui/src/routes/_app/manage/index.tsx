import { Add01Icon, Briefcase01Icon } from '@hugeicons/core-free-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  deletePortfolio,
  fetchPortfolios,
  type Portfolio,
} from '@/api/portfolios';
import {
  CreatePortfolioForm,
  DeletePortfolioDialog,
  EmptyState,
  PortfolioTable,
} from '@/components/manage';
import { useTranslation } from '@/hooks/use-translation';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentSubHeader,
  ContentTitle,
} from '@/layouts/content.layout';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Icon } from '@/ui/icon';

export const Route = createFileRoute('/_app/manage/')({
  component: ManagePage,
});

function ManagePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: fetchPortfolios,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    mutationKey: ['deletePortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success(t('manage.deleteSuccess'));
      setPortfolioToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || t('manage.deleteError'));
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, portfolio: Portfolio) => {
    e.stopPropagation();
    setPortfolioToDelete(portfolio);
  };

  const handleRowClick = (portfolio: Portfolio) => {
    navigate({
      to: '/manage/portfolio/$portfolioId',
      params: { portfolioId: portfolio.id },
    });
  };

  const confirmDelete = () => {
    if (!portfolioToDelete) {
      toast.error(t('manage.deleteError'));
      return;
    }
    deleteMutation.mutate(portfolioToDelete.id);
  };

  const hasPortfolios = portfolios && portfolios.length > 0;

  if (isLoading) {
    return (
      <ContentLayout cy="manage">
        <ContentHeader cy="manage">
          <ContentTitle cy="manage">
            <Icon icon={Briefcase01Icon} />
            {t('manage.title')}
          </ContentTitle>
        </ContentHeader>
        <ContentBody
          className="flex flex-1 items-center justify-center"
          cy="manage"
        >
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </ContentBody>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout cy="manage">
      <ContentHeader cy="manage">
        <ContentTitle cy="manage">
          <Icon icon={Briefcase01Icon} />
          {t('manage.pageTitle')}
          {portfolios && portfolios.length > 0 && (
            <Badge variant="outline">{portfolios.length}</Badge>
          )}
        </ContentTitle>
      </ContentHeader>
      <ContentSubHeader className="justify-end" cy="manage">
        <Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Icon icon={Add01Icon} />
              {t('manage.addPortfolio')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('manage.createDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('manage.createDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <CreatePortfolioForm
              hideCard
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </ContentSubHeader>
      <ContentBody className="flex-1" cy="manage">
        {hasPortfolios ? (
          <div className="flex flex-col gap-4">
            <PortfolioTable
              onDeleteClick={handleDeleteClick}
              onRowClick={handleRowClick}
              portfolios={portfolios}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </ContentBody>

      <DeletePortfolioDialog
        isDeleting={deleteMutation.isPending}
        onClose={() => setPortfolioToDelete(null)}
        onConfirm={confirmDelete}
        portfolio={portfolioToDelete}
      />
    </ContentLayout>
  );
}
