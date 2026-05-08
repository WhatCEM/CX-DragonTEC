import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

/** * Componente de ruta protegida para administradores.
 * - Sin autenticar        → /login
 * - Autenticado no-admin  → / (dashboard, silencioso)
 * - Admin                 → renderiza children
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.accessType !== 'admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;