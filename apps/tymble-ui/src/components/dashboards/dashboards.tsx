import { useTranslation } from '@/hooks/use-translation';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentSubHeader,
  ContentTitle,
} from '@/layouts/content.layout';
import { Badge } from '@/ui/badge';
import { Dashboard } from './dashboard/dashboard';

export const Dashboards = () => {
  const { t } = useTranslation();
  return (
    <ContentLayout cy="dashboards">
      <ContentHeader cy="dashboards">
        <ContentTitle cy="dashboards">
          Dashboards <Badge variant="secondary">4</Badge>
        </ContentTitle>
      </ContentHeader>
      <ContentSubHeader cy="dashboards">
        <ContentTitle cy="dashboards">Dashboards</ContentTitle>
      </ContentSubHeader>
      <ContentBody>
        <Dashboard />
      </ContentBody>
    </ContentLayout>
  );
};
