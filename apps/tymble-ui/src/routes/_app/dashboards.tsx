import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboards')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="p-content-padding">dashboards</div>;
}
