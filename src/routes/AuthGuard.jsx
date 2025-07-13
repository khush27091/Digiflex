import {  Outlet ,Navigate } from 'react-router-dom';

export default function AuthGuard() {
  const isAuthenticated = sessionStorage.getItem('accessToken'); // Or use your auth logic

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
