import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Dashboard from '../pages/Dashboard';
import About from '../pages/About';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);
