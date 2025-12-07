import { useTranslation } from '@/hooks/use-translation';
import { ContentLayout } from '@/layouts/content.layout';

export const Dashboards = () => {
  const { t } = useTranslation();
  return (
    <ContentLayout pageId="dashboards">
      <h1>My Dashboards</h1>
    </ContentLayout>
  );
};
