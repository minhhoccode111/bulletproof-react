import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { AuthLoader } from '@/lib/auth';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // react query setup for data fetching and caching
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      {/* used to catch and handle errors that occur within the application */}
      {/* ErrorBoundary: is likely used to display a fallback UI when an error occurs */}
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        {/* manage the application's document head (e.g., title, meta tags, etc.) good for SEO */}
        <HelmetProvider>
          {/* QueryClientProvider: wrap the application and provide a shared `QueryClient` instance */}
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            {/* notification system to display notifications to the user */}
            <Notifications />
            {/* configure and manage authentication in the application */}
            <AuthLoader
              renderLoading={() => (
                <div className="flex h-screen w-screen items-center justify-center">
                  <Spinner size="xl" />
                </div>
              )}
            >
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
