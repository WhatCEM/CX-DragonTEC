import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

// ── Configuración de roles ────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  superadmin: { label: 'Superadmin', bg: '#fef3c7', color: '#92400e' },
  admin:      { label: 'Admin',      bg: '#dbeafe', color: '#1e40af' },
  regular:    { label: 'Regular',    bg: '#f3f4f6', color: '#374151' },
  user:       { label: 'Usuario',    bg: '#f3f4f6', color: '#374151' }, // compatibilidad
};

const RoleBadge = ({ accessType }: { accessType?: string }) => {
  const role = ROLE_LABELS[accessType ?? ''] ?? { label: accessType ?? '—', bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      fontSize: '0.68rem',
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: '4px',
      background: role.bg,
      color: role.color,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {role.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const appName      = import.meta.env.VITE_APP_NAME || 'DtechCX';
  const isSuperAdmin = user?.accessType === 'superadmin';

  const navItems = [
    { path: '/',         label: 'Dashboard' },
    { path: '/about',   label: 'About'     },
    { path: '/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-container">
      <header className="app-header">

        {/* ── Marca ─────────────────────────────────────────────────────────── */}
        <div className="header-brand">
          <h1>{appName}</h1>
        </div>

        {/* ── Navegación ────────────────────────────────────────────────────── */}
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

            {/* Crear usuario: visible SOLO para superadmin */}
            {isSuperAdmin && (
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Badge de rol a la IZQUIERDA del botón (solo superadmin) */}
                <RoleBadge accessType={user?.accessType} />
                <Link
                  to="/admin/users"
                  className={location.pathname === '/admin/users' ? 'active' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#fbbf24',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M1 14c0-3 2-5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Usuarios
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* ── Usuario + badge (si no es superadmin) + logout ────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.85rem',
            }}>
              {user.name}
              {/* Badge de rol a la DERECHA del nombre, si NO es superadmin */}
              {!isSuperAdmin && <RoleBadge accessType={user.accessType} />}
            </span>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            Salir
          </button>
        </div>

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