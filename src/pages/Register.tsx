//de momento esto se va a quedar en otra rama, pero es el diseño de la página de registro, que reutiliza los estilos del login para mantener consistencia visual. La lógica de validación y envío también es similar, con algunos ajustes para el campo de nombre y confirmación de contraseña.
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; // Reutiliza los mismos estilos del Login

const API_URL = import.meta.env.VITE_API_URL;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors]                 = useState<FormErrors>({});
  const [isLoading, setIsLoading]           = useState(false);
  const [showPass, setShowPass]             = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [successMsg, setSuccessMsg]         = useState('');

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!name.trim()) {
      e.name = 'El nombre es obligatorio';
    } else if (name.trim().length < 2) {
      e.name = 'Mínimo 2 caracteres';
    }

    if (!email.trim()) {
      e.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Formato de correo inválido';
    }

    if (!password) {
      e.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      e.password = 'Mínimo 6 caracteres';
    }

    if (!confirmPassword) {
      e.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setIsLoading(true);
  setErrors({});
  setSuccessMsg('');

  try {
// Dentro de handleSubmit en Register.tsx
const res = await fetch(`${API_URL}/auth/register`, { // Verifica que API_URL termine en /api
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    name: name.trim(),  // Enviamos 'name' para que coincida con el validador y el modelo
    email: email, 
    password: password 
  }),
});
    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.message || 'Error al crear la cuenta' });
      return;
    }

    setSuccessMsg('Cuenta creada correctamente. Redirigiendo...');
    setTimeout(() => navigate('/login', { replace: true }), 1800);
  } catch {
    setErrors({ general: 'Error de red. Intenta de nuevo.' });
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="login-root">

      {/* ── Panel izquierdo (idéntico al Login) ───── */}
      <div
        className="login-left"
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <div className="login-left__noise" />

        <header className="login-brand">
          <div className="login-brand__icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1"  y="1"  width="7.5" height="7.5" rx="1.5" fill="white"/>
              <rect x="11" y="1"  width="7.5" height="7.5" rx="1.5" fill="white"/>
              <rect x="1"  y="11" width="7.5" height="7.5" rx="1.5" fill="white"/>
              <rect x="11" y="11" width="7.5" height="7.5" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="login-brand__name">CX Dtec</span>
        </header>

        <div
          className="login-left__body"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: '10%',
            paddingRight: '10%',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: '550px' }}>
            <h1 className="login-hero" style={{ margin: 0, lineHeight: '1.2' }}>
              Empieza a gestionar tu operación hoy
            </h1>
            <p className="login-sub" style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
              Crea tu cuenta y accede a onboarding, ventas y comunicación con clientes en un solo lugar.
            </p>
          </div>
        </div>

        <footer className="login-footer">
          © {new Date().getFullYear()} CX Dtec Inc. Todos los derechos reservados.
        </footer>
      </div>

      {/* ── Panel derecho ────────────────────────── */}
      <div
        className="login-right"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
        }}
      >
        <div
          className="login-card"
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow:
              '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
          }}
        >
          <h2 className="login-card__title">Crear cuenta</h2>
          <p className="login-card__sub">Completa los datos para unirte a CX Dtec</p>

          <form onSubmit={handleSubmit} noValidate className="login-form">

            {/* Nombre completo */}
            <div className="lf-field">
              <label htmlFor="name">Nombre completo</label>
              <div className={`lf-input-wrap ${errors.name ? 'is-error' : ''}`}>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  autoComplete="name"
                  disabled={isLoading}
                />
                <span className="lf-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              {errors.name && <span className="lf-error">{errors.name}</span>}
            </div>

            {/* Correo */}
            <div className="lf-field">
              <label htmlFor="email">Correo electrónico</label>
              <div className={`lf-input-wrap ${errors.email ? 'is-error' : ''}`}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
                <span className="lf-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1.5 4.5L8 9.5L14.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              {errors.email && <span className="lf-error">{errors.email}</span>}
            </div>

            {/* Contraseña */}
            <div className="lf-field">
              <label htmlFor="password">Contraseña</label>
              <div className={`lf-input-wrap ${errors.password ? 'is-error' : ''}`}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="lf-icon lf-icon--btn"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M6.5 6.7A2 2 0 0 0 9.3 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M4 4.3C2.6 5.3 1.5 6.5 1 8c1.1 3 4 5 7 5 1.4 0 2.7-.4 3.8-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M9.9 3.8A6.8 6.8 0 0 1 15 8c-.5 1.4-1.4 2.6-2.6 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8c1.1-3 4-5 7-5s5.9 2 7 5c-1.1 3-4 5-7 5s-5.9-2-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="lf-error">{errors.password}</span>}
            </div>

            {/* Confirmar contraseña */}
            <div className="lf-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className={`lf-input-wrap ${errors.confirmPassword ? 'is-error' : ''}`}>
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="lf-icon lf-icon--btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirm ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M6.5 6.7A2 2 0 0 0 9.3 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M4 4.3C2.6 5.3 1.5 6.5 1 8c1.1 3 4 5 7 5 1.4 0 2.7-.4 3.8-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M9.9 3.8A6.8 6.8 0 0 1 15 8c-.5 1.4-1.4 2.6-2.6 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8c1.1-3 4-5 7-5s5.9 2 7 5c-1.1 3-4 5-7 5s-5.9-2-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="lf-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="lf-general-error">{errors.general}</div>
            )}

            {/* Mensaje de éxito */}
            {successMsg && (
              <div
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  fontSize: '0.82rem',
                  marginBottom: '0.5rem',
                }}
              >
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="lf-submit"
              disabled={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta →'}
            </button>
          </form>

          <p className="login-card__contact" style={{ marginTop: '1.5rem' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#0d5c73', fontWeight: 600 }}>
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;