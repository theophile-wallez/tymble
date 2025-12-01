import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboards')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/dashboards"!</div>
}
