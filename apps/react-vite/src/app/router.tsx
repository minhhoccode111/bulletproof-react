// QueryClient: type of instance return from useQueryClient
// useQueryClient: responsible for managing server state (caching and fetching data)
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

// AppRootErrorBoundary: the last component to display when errors occur
// AppRoot: Outlet component inside a layout wrapper
import { AppRoot, AppRootErrorBoundary } from './routes/app/root';

// createAppRouter: takes instance of queryClient, return a router config object
// to pass to RouterProvider
export const createAppRouter = (queryClient: QueryClient) =>
  // takes an array of route definitions, where each router is an object with a
  // path and an lazy function that return component to render
  createBrowserRouter([
    {
      // path: global config paths
      path: paths.home.path,
      // lazy loading is used to dynamically import route components, reducing
      // initial load time by only loading route code when needed
      lazy: async () => {
        const { LandingRoute } = await import('./routes/landing');
        return { Component: LandingRoute };
      },
    },
    {
      path: paths.auth.register.path,
      lazy: async () => {
        const { RegisterRoute } = await import('./routes/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: paths.auth.login.path,
      lazy: async () => {
        const { LoginRoute } = await import('./routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: paths.app.root.path,
      element: (
        // a wrapper make sure user is logged in before they can access a component
        <ProtectedRoute>
          {/* AppRoot: Outlet component inside a layout wrapper*/}
          <AppRoot />
        </ProtectedRoute>
      ),
      // the last component to display when errors occur
      ErrorBoundary: AppRootErrorBoundary,
      // children: routes specify here will be display dynamic with Outlet
      children: [
        {
          path: paths.app.discussions.path,
          lazy: async () => {
            // discussionsLoader: pre-fetch data based on the queryClient
            // this get many discussions, page 1
            const { DiscussionsRoute, discussionsLoader } = await import(
              './routes/app/discussions/discussions'
            );
            return {
              Component: DiscussionsRoute,
              // loader: function to run before component mount
              // call discussionsLoader with queryClient param which return the
              // actual loader async function
              loader: discussionsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.discussion.path,
          lazy: async () => {
            const { DiscussionRoute, discussionLoader } = await import(
              './routes/app/discussions/discussion'
            );
            return {
              Component: DiscussionRoute,
              loader: discussionLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.users.path,
          lazy: async () => {
            const { UsersRoute, usersLoader } = await import(
              './routes/app/users'
            );
            return {
              Component: UsersRoute,
              loader: usersLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.profile.path,
          lazy: async () => {
            const { ProfileRoute } = await import('./routes/app/profile');
            return {
              Component: ProfileRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.dashboard.path,
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/app/dashboard');
            return {
              Component: DashboardRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
      ],
    },
    {
      // every other path goes to not found
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return {
          Component: NotFoundRoute,
        };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ]);

// return our app wrapped inside a router provider
export const AppRouter = () => {
  // useQueryClient: responsible for managing server state (caching and fetching data)
  const queryClient = useQueryClient();

  // use useMemo to remember the router object return from calling createAppRouter
  // and don't change until the queryClient object change
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  // return wrapper component RouterProvider
  return <RouterProvider router={router} />;
};
