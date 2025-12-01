import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

const AppLayout = () => (
  <>
    <div className="flex gap-2 p-2">
      <Link className="[&.active]:font-bold" to="/">
        Home
      </Link>
      <Link className="[&.active]:font-bold" to="/about">
        About
      </Link>
      <Link className="[&.active]:font-bold" to="/login">
        Login
      </Link>
    </div>
    <hr />
    <Outlet />
  </>
);

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});
