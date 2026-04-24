import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * AdminRoute
 *
 * Wrapper para rutas exclusivas de superadmin.
 * - Si no está autenticado → /login
 * - Si está autenticado pero NO es superadmin → / (dashboard)
 * - Si es superadmin → renderiza el children
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Evita flash durante hidratación

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.accessType !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;