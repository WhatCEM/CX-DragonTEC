import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Dashboard from '../pages/Dashboard';
import About from '../pages/About';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  // Ruta pública: Login (sin RootLayout para que tenga su propio look)
  {
    path: '/login',
    element: <Login />,
  },
  // Rutas privadas: dentro de RootLayout, todas protegidas
  {
    path: '/',
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'about', element: <About /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  // Cualquier ruta desconocida → redirect a login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);