import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Briefcase, Package } from 'lucide-react';
import { fetchPortfolio } from '@/api/portfolios';
import { AddAssetForm } from '@/components/manage/portfolio-detail/add-asset-form';
import { AssetsList } from '@/components/manage/portfolio-detail/assets-list';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentTitle,
} from '@/layouts/content.layout';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

export const Route = createFileRoute('/_app/portfolio/$portfolioId')({
  component: PortfolioDetailPage,
});

function PortfolioDetailPage() {
  const { portfolioId } = Route.useParams();

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => fetchPortfolio(portfolioId),
  });

  if (isLoading) {
    return (
      <ContentLayout cy="portfolio-detail">
        <ContentHeader cy="portfolio-detail">
          <ContentTitle cy="portfolio-detail">
            <Briefcase className="size-4" />
            Loading...
          </ContentTitle>
        </ContentHeader>
        <ContentBody
          className="flex flex-1 items-center justify-center"
          cy="portfolio-detail"
        >
          <div className="text-muted-foreground">Loading portfolio...</div>
        </ContentBody>
      </ContentLayout>
    );
  }

  if (!portfolio) {
    return (
      <ContentLayout cy="portfolio-detail">
        <ContentHeader cy="portfolio-detail">
          <ContentTitle cy="portfolio-detail">
            <Briefcase className="size-4" />
            Portfolio not found
          </ContentTitle>
        </ContentHeader>
        <ContentBody
          className="flex flex-1 items-center justify-center"
          cy="portfolio-detail"
        >
          <div className="text-muted-foreground">
            This portfolio doesn't exist or you don't have access to it.
          </div>
        </ContentBody>
      </ContentLayout>
    );
  }

  const hasAssets = portfolio.assets && portfolio.assets.length > 0;

  return (
    <ContentLayout cy="portfolio-detail">
      <ContentHeader cy="portfolio-detail">
        <div className="flex items-center gap-4">
          <Link to="/manage">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <ContentTitle cy="portfolio-detail">
            <Briefcase className="size-4" />
            {portfolio.name}
            <Badge className="ml-2" variant="outline">
              {portfolio.type}
            </Badge>
          </ContentTitle>
        </div>
      </ContentHeader>

      <ContentBody className="flex flex-1 flex-col gap-8" cy="portfolio-detail">
        {/* Add Asset Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            <h2 className="font-medium text-lg">Add an asset</h2>
          </div>
          <AddAssetForm portfolioId={portfolioId} />
        </section>

        {/* Assets Overview Section */}
        {hasAssets && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Package className="size-4" />
              <h2 className="font-medium text-lg">
                Your assets ({portfolio.assets.length})
              </h2>
            </div>
            <AssetsList assets={portfolio.assets} />
          </section>
        )}
      </ContentBody>
    </ContentLayout>
  );
}
