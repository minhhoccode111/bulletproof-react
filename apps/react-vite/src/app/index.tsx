import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  return (
    <AppProvider>
      {/* our app wrap in RouterProvider */}
      <AppRouter />
    </AppProvider>
  );
};
