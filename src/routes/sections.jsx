import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import AuthGuard from './AuthGuard';
import GuestGuard from './GuestGuard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UserAddPage = lazy(() => import('src/sections/user/user-form-page'));


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
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
        { element: <UserPage />, index: true },
        { path: 'new', element: <UserAddPage /> },  // ✅ Now this is /user/new
      ],
    },
    { path: 'products', element: <ProductsPage /> },
    { path: 'blog', element: <BlogPage /> },
  ],
},
    {
  path: '/login',
  element: (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  ),
},
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
