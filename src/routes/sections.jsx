import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import AuthGuard from './AuthGuard';
import GuestGuard from './GuestGuard';
import RootRedirect from './RootRedirect'; // ✅ NEW

// Lazy-loaded Pages
export const IndexPage = lazy(() => import('src/pages/app'));
export const MeasurementPage = lazy(() => import('src/pages/Measurement'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const UserPage = lazy(() => import('src/pages/user'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const MeasurementAddPage = lazy(() => import('src/sections/Measurement/measurement-form-page'));

export default function Router() {
  const routes = useRoutes([
    // ✅ Redirect root
    {
      path: '/',
      element: <RootRedirect />,
    },

    // ✅ Dashboard Layout with AuthGuard
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <Suspense>
            <AuthGuard>
              <Outlet />
            </AuthGuard>
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        {
          path: 'user',
          children: [
            { element: <MeasurementPage />, index: true },
            { path: 'new', element: <MeasurementAddPage /> },
          ],
        },
        {
          path: 'products',
          children: [{ element: <UserPage />, index: true }],
        },
      ],
    },

    // ✅ Login Page (Public)
    {
      path: '/login',
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },

    // ✅ 404 and catch-all
    {
      path: '/404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
