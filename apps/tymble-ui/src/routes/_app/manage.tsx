import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Briefcase, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  deletePortfolio,
  fetchPortfolios,
  type Portfolio,
} from '@/api/portfolios';
import {
  DeletePortfolioDialog,
  EmptyState,
  PortfolioTable,
} from '@/components/manage';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentSubHeader,
  ContentTitle,
} from '@/layouts/content.layout';

export const Route = createFileRoute('/_app/manage')({
  component: ManagePage,
});

function ManagePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(
    null
  );

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: fetchPortfolios,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    mutationKey: ['deletePortfolio'],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast.success('Portfolio deleted successfully!');
      setPortfolioToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to delete portfolio. Please try again.'
      );
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, portfolio: Portfolio) => {
    e.stopPropagation();
    setPortfolioToDelete(portfolio);
  };

  const handleManageClick = (e: React.MouseEvent, portfolio: Portfolio) => {
    e.stopPropagation();
    navigate({ to: '/portfolio/$portfolioId', params: { portfolioId: portfolio.id } });
  };

  const confirmDelete = () => {
    if (portfolioToDelete) {
      deleteMutation.mutate(portfolioToDelete.id);
    }
  };

  const hasPortfolios = portfolios && portfolios.length > 0;

  if (isLoading) {
    return (
      <ContentLayout cy="manage">
        <ContentHeader cy="manage">
          <ContentTitle cy="manage">
            <Briefcase className="size-4" />
            Manage
          </ContentTitle>
        </ContentHeader>
        <ContentBody
          className="flex flex-1 items-center justify-center"
          cy="manage"
        >
          <div className="text-muted-foreground">Loading...</div>
        </ContentBody>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout cy="manage">
      <ContentHeader cy="manage">
        <ContentTitle cy="manage">
          <Briefcase className="size-4" />
          Manage your portfolios
        </ContentTitle>
      </ContentHeader>
      <ContentSubHeader cy="manage">
        <ContentTitle cy="manage">
          <Plus className="size-4" />
          Add Portfolio
        </ContentTitle>
      </ContentSubHeader>
      <ContentBody className="flex-1" cy="manage">
        {hasPortfolios ? (
          <div className="flex flex-col gap-4">
            <PortfolioTable
              onDeleteClick={handleDeleteClick}
              onManageClick={handleManageClick}
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
