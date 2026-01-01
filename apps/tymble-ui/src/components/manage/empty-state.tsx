import { Wallet01Icon } from '@hugeicons/core-free-icons';
import { Icon } from '@/ui/icon';
import { useTranslation } from '@/hooks/use-translation';
import { CreatePortfolioForm } from './create-portfolio-form';

export const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex size-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Icon icon={Wallet01Icon} className="size-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">
            {t('manage.portfolio.emptyTitle')}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {t('manage.portfolio.emptyDescription')}
          </p>
        </div>
      </div>
      <CreatePortfolioForm />
    </div>
  );
};
