import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  PackageIcon,
} from '@hugeicons/core-free-icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { fetchPortfolio } from '@/api/portfolios';
import { AddAssetDialog } from '@/components/assets/add-asset-dialog';
import { AssetCard } from '@/components/assets/asset-card';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentTitle,
} from '@/layouts/content.layout';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Icon } from '@/ui/icon';

export const Route = createFileRoute('/_app/manage/portfolio/$portfolioId')({
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
            <Icon icon={Briefcase01Icon} />
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
            <Icon icon={Briefcase01Icon} />
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

  // Calculate total portfolio value
  const totalValue =
    portfolio.assets?.reduce(
      (sum, asset) =>
        sum +
        Number.parseFloat(asset.averagePrice) *
          Number.parseFloat(asset.quantity),
      0
    ) ?? 0;

  return (
    <ContentLayout cy="portfolio-detail">
      <ContentHeader cy="portfolio-detail">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/manage">
              <Button size="icon-sm" variant="ghost">
                <Icon icon={ArrowLeft01Icon} />
              </Button>
            </Link>
            <ContentTitle cy="portfolio-detail">
              <Icon icon={Briefcase01Icon} />
              {portfolio.name}
              <Badge className="ml-2" variant="outline">
                {portfolio.type}
              </Badge>
            </ContentTitle>
          </div>
          {totalValue > 0 && (
            <div className="text-right">
              <div className="text-muted-foreground text-sm">Total Value</div>
              <div className="font-semibold text-xl">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          )}
        </div>
      </ContentHeader>

      <ContentBody className="flex flex-1 flex-col gap-6" cy="portfolio-detail">
        <div className="flex items-center gap-2">
          <Icon icon={PackageIcon} />
          <h2 className="font-medium text-lg">
            Assets{' '}
            {portfolio.assets &&
              portfolio.assets.length > 0 &&
              `(${portfolio.assets.length})`}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AddAssetDialog portfolioId={portfolioId} />

          {portfolio.assets?.map((asset) => (
            <AssetCard asset={asset} key={asset.id} />
          ))}
        </div>
      </ContentBody>
    </ContentLayout>
  );
}
