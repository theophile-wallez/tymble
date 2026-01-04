import type { PortfolioWithRelations } from '@tymble/schemas';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardHeader } from '@/ui/card';

type Asset = PortfolioWithRelations['assets'][number];
type Props = {
  asset: Asset;
};

export const AssetCard = ({ asset }: Props) => {
  const quantity = Number.parseFloat(asset.quantity);
  const price = Number.parseFloat(asset.averagePrice);
  const totalValue = quantity * price;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{asset.instrument.symbol}</h3>
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {asset.instrument.name}
            </p>
          </div>
          <Badge variant="outline">{asset.instrument.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">
              {quantity.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg. Price</span>
            <span className="font-medium">
              $
              {price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Total Value</span>
              <span className="font-semibold">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
