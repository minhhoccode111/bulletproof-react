import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  return (
    // wrapper to provide: React.Suspense, ErrorBoundary, HelmetProvider, queryClient, Notification, AuthLoader
    <AppProvider>
      {/* our app wrap in RouterProvider */}
      <AppRouter />
    </AppProvider>
  );
};
