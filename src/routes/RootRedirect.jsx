// src/guards/RootRedirect.jsx
import { Navigate } from 'react-router-dom';

export default function RootRedirect() {
  const isAuthenticated = sessionStorage.getItem('accessToken');
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}
