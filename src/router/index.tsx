import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout    from '../layouts/RootLayout';
import Dashboard     from '../pages/Dashboard';
import About         from '../pages/About';
import Settings      from '../pages/Settings';
import NotFound      from '../pages/NotFound';
import Login         from '../pages/Login';
import Register      from '../pages/Register';
import AdminUsers    from '../pages/AdminUsers';  
import PrivateRoute  from './PrivateRoute';
import AdminRoute    from './AdminRoute';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';   
import NewClient from '../pages/NewClient'; 

export const router = createBrowserRouter([
  // ── Rutas públicas ─────────────────────────────────────────────────────────
  { path: '/login',    element: <Login />    },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },

  // ── Rutas privadas (cualquier usuario autenticado) ─────────────────────────
  {
    path: '/',
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true,        element: <Dashboard /> },
      { path: 'about',      element: <About />     },
      { path: 'settings',   element: <Settings />  },

      // ── Rutas exclusivas superadmin ───────────────────────────────────────────
      { 
        path: 'admin/clients/new', 
        element: <AdminRoute><NewClient /></AdminRoute> 
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        )
      } // <--- Coma agregada automáticamente por la estructura del array
    ]
  },

  // ── Comodín (Fuera de las rutas privadas para capturar errores de login/register) ──
  { path: '*', element: <Navigate to="/login" replace /> }
]);