import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

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

const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isLoginRoute = pathname === '/login';

  return (
    <>
      {isLoginRoute ? <Outlet /> : <AppLayout />}
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
