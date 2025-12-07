import { useTranslation } from '@/hooks/use-translation';
import {
  ContentHeader,
  ContentLayout,
  ContentTitle,
} from '@/layouts/content.layout';

export const Dashboards = () => {
  const { t } = useTranslation();
  return (
    <ContentLayout cy="dashboards">
      <ContentHeader cy="dashboards">
        <ContentTitle cy="dashboards">Dashboards</ContentTitle>
      </ContentHeader>
    </ContentLayout>
  );
};
