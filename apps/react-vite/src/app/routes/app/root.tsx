import { Outlet } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts';

// Outlet component inside a layout wrapper
export const AppRoot = () => {
  return (
    // app layout wrapper
    <DashboardLayout>
      {/* the dynamic component to change when current route is changed */}
      <Outlet />
    </DashboardLayout>
  );
};

// the last component to display when errors occur
export const AppRootErrorBoundary = () => {
  console.log('Something went wrong!');
  return <div>Something went wrong!</div>;
};
