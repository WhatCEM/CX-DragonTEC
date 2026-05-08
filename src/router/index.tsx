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
import AdminRoute    from './AdminRoute'; // ← Ruta exclusiva para superadmin
import ForgotPassword from '../pages/ForgotPassword'; // ← en vez del modal, ahora es una página independiente
import ResetPassword from '../pages/ResetPassword';   // ← en vez del modal, ahora es una página independiente


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
      { index: true,         element: <Dashboard /> },
      { path: 'about',      element: <About />     },
      { path: 'settings',   element: <Settings />  },

      // ── Ruta exclusiva superadmin ───────────────────────────────────────────
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
    ],
  },

  // ── Comodín ────────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/login" replace /> },
]);