import { Navigate } from 'react-router-dom';

/**
 * Wraps protected routes — redirects to /login if no authenticated user found.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('currentUser'));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
