import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/layout.css';

const RootLayout = () => {
    const location = useLocation();
    const appName = import.meta.env.VITE_APP_NAME || 'DtechCX';

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/about', label: 'About' },
        { path: '/settings', label: 'Settings' },
    ];

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-brand">
                    <h1>{appName}</h1>
                </div>
                <nav className="app-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={location.pathname === item.path ? 'active' : ''}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
            <main className="app-main">
                <Outlet />
            </main>
            <footer className="app-footer">
                <p>
                    &copy; {new Date().getFullYear()} {appName}. Environment:{' '}
                    <span className="env-badge">{import.meta.env.MODE}</span>
                </p>
            </footer>
        </div>
    );
};

export default RootLayout;
