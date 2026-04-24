import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_API_URL;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const AdminUsers = () => {
  const { token } = useAuth();

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors]                   = useState<FormErrors>({});
  const [isLoading, setIsLoading]             = useState(false);
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [successMsg, setSuccessMsg]           = useState('');

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim())          e.name    = 'El nombre es obligatorio';
    if (!email.trim())         e.email   = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                               e.email   = 'Formato de correo inválido';
    if (!password)             e.password = 'La contraseña es obligatoria';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (!confirmPassword)      e.confirmPassword = 'Confirma la contraseña';
    else if (password !== confirmPassword)
                               e.confirmPassword = 'Las contraseñas no coinciden';
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
      const res = await fetch(`${API_URL}/auth/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Token del superadmin en sesión
        },
        body: JSON.stringify({ userName: name.trim(), email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.msg || 'Error al crear el usuario' });
        return;
      }

      setSuccessMsg(`Usuario "${data.name}" creado correctamente`);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrors({ general: 'Error de red. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        padding: '2.5rem',
      }}>
        {/* Header de la sección */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: '#fef3c7',
              color: '#92400e',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Superadmin
            </span>
          </div>
          <h2 className="login-card__title" style={{ fontSize: '1.5rem' }}>
            Crear nuevo usuario
          </h2>
          <p className="login-card__sub">
            Los usuarios creados tendrán acceso regular al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">

          {/* Nombre */}
          <div className="lf-field">
            <label htmlFor="au-name">Nombre completo</label>
            <div className={`lf-input-wrap ${errors.name ? 'is-error' : ''}`}>
              <input
                id="au-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                autoComplete="off"
                disabled={isLoading}
              />
              <span className="lf-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
            {errors.name && <span className="lf-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="lf-field">
            <label htmlFor="au-email">Correo electrónico</label>
            <div className={`lf-input-wrap ${errors.email ? 'is-error' : ''}`}>
              <input
                id="au-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                autoComplete="off"
                disabled={isLoading}
              />
              <span className="lf-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2"
                    stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1.5 4.5L8 9.5L14.5 4.5"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
            {errors.email && <span className="lf-error">{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="lf-field">
            <label htmlFor="au-password">Contraseña</label>
            <div className={`lf-input-wrap ${errors.password ? 'is-error' : ''}`}>
              <input
                id="au-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button type="button" className="lf-icon lf-icon--btn"
                onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M4 4.3C2.6 5.3 1.5 6.5 1 8c1.1 3 4 5 7 5 1.4 0 2.7-.4 3.8-1.2"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8c1.1-3 4-5 7-5s5.9 2 7 5c-1.1 3-4 5-7 5s-5.9-2-7-5z"
                      stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="lf-error">{errors.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div className="lf-field">
            <label htmlFor="au-confirm">Confirmar contraseña</label>
            <div className={`lf-input-wrap ${errors.confirmPassword ? 'is-error' : ''}`}>
              <input
                id="au-confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button type="button" className="lf-icon lf-icon--btn"
                onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                {showConfirm ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M4 4.3C2.6 5.3 1.5 6.5 1 8c1.1 3 4 5 7 5 1.4 0 2.7-.4 3.8-1.2"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8c1.1-3 4-5 7-5s5.9 2 7 5c-1.1 3-4 5-7 5s-5.9-2-7-5z"
                      stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="lf-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Mensajes */}
          {errors.general && (
            <div className="lf-general-error">{errors.general}</div>
          )}
          {successMsg && (
            <div style={{
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.82rem',
            }}>
              ✓ {successMsg}
            </div>
          )}

          <button
            type="submit"
            className="lf-submit"
            disabled={isLoading}
            style={{ marginTop: '0.75rem' }}
          >
            {isLoading ? 'Creando usuario...' : 'Crear usuario →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;