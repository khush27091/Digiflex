import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export default function GuestGuard({ children }) {
  const isAuthenticated = sessionStorage.getItem('accessToken');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

GuestGuard.propTypes = {
  children: PropTypes.node
};
