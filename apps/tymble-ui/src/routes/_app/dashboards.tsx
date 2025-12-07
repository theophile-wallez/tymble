import { createFileRoute } from '@tanstack/react-router';
import { Dashboards } from '@/components/dashboards/dashboards';

export const Route = createFileRoute('/_app/dashboards')({
  component: () => <Dashboards />,
});
