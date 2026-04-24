import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';  // ← Quita Link si no lo usas
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../pages/ForgotPasswordModal';
import '../styles/login.css';   

const API_URL = import.meta.env.VITE_API_URL;

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.msg || 'Credenciales incorrectas' });
        return;
      }

      const token = data.token;
     const user = { 
  id: data.uid, 
  name: data.name, 
  email: email,
  accessType: data.accessType || 'regular'  // ← Usar el accessType del backend
};
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (login) {
        login(token, user);
      }
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Error de red. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-root">
        {/* Panel izquierdo */}
        <div className="login-left" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          <div className="login-left__body" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: '10%',
            paddingRight: '10%'
          }}>
            <div style={{ textAlign: 'left', maxWidth: '550px' }}>
              <h1 className="login-hero" style={{ margin: 0, lineHeight: '1.2' }}>
                Gestiona tu operación en un solo lugar
              </h1>
              <p className="login-sub" style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
                Onboarding, ventas y comunicación con tus clientes, sin fricción.
              </p>
            </div>
          </div>
          <footer className="login-footer">
            © {new Date().getFullYear()} CX Dtec Inc. Todos los derechos reservados.
          </footer>
        </div>

        {/* Panel derecho */}
        <div className="login-right" style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f8fafc'
        }}>
          <div className="login-card" style={{ 
            width: '100%', 
            maxWidth: '440px', 
            backgroundColor: '#ffffff', 
            padding: '2.5rem', 
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 className="login-card__title">Iniciar sesión</h2> 
            <p className="login-card__sub">Accede a tu cuenta de CX Dtec</p>

            <form onSubmit={handleSubmit} noValidate className="login-form">
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

              <div className="lf-field">
                <label htmlFor="password">Contraseña</label>
                <div className={`lf-input-wrap ${errors.password ? 'is-error' : ''}`}>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="lf-icon lf-icon--btn"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="lf-error">{errors.password}</span>}
              </div>

              <div className="lf-forgot">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {errors.general && <div className="lf-general-error">{errors.general}</div>}

              <button type="submit" className="lf-submit" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
              </button>
            </form>

            <p className="login-card__contact">
              ¿No tienes acceso?{' '}
              <a href="mailto:admin@cxdtec.com">Contacta a tu administrador</a>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Login;