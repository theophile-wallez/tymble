import type { Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import type { Portfolio } from '@/api/portfolios';
import { getProviderLabel, getTypeLabel } from './portfolio-constants';

type PortfolioRowDetailsProps = {
  row: Row<Portfolio>;
};

export const PortfolioRowDetails = ({ row }: PortfolioRowDetailsProps) => {
  const portfolio = row.original;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div>
        <p className="text-muted-foreground text-xs">Type</p>
        <p className="font-medium text-sm">{getTypeLabel(portfolio.type)}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Provider</p>
        <p className="font-medium text-sm">
          {getProviderLabel(portfolio.provider)}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Created</p>
        <p className="font-medium text-sm">
          {format(new Date(portfolio.createdAt), 'MMM d, yyyy')}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs">Last updated</p>
        <p className="font-medium text-sm">
          {format(new Date(portfolio.updatedAt), 'MMM d, yyyy')}
        </p>
      </div>
      {portfolio.description && (
        <div className="col-span-full">
          <p className="text-muted-foreground text-xs">Description</p>
          <p className="text-sm">{portfolio.description}</p>
        </div>
      )}
    </div>
  );
};
