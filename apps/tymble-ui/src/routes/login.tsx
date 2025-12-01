import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: AboutComponent,
});

function AboutComponent() {
  return <div>About</div>;
}
