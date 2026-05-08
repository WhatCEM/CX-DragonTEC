import { useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_API_URL;

type Stage = 'form' | 'success' | 'error';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// ── Lógica de fuerza de contraseña ───────────────────────────────────────────
const getStrength = (val: string): number => {
  let s = 0;
  if (val.length > 6)           s++;
  if (val.length > 10)          s++;
  if (/[0-9]/.test(val))        s++;
  if (/[!@#$%^&*]/.test(val))   s++;
  return s;
};

const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
const strengthColor = ['', '#f97316', '#f97316', '#0d5c73', '#059669'];

// ─────────────────────────────────────────────────────────────────────────────

const ResetPassword = () => {
  const { token }  = useParams<{ token: string }>();
  const navigate   = useNavigate();

  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [strength, setStrength]               = useState(0);
  const [errors, setErrors]                   = useState<FormErrors>({});
  const [isLoading, setIsLoading]             = useState(false);
  const [stage, setStage]                     = useState<Stage>('form');

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setStrength(getStrength(val));
    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!password)
      e.password = 'La contraseña es obligatoria';
    else if (password.length < 6)
      e.password = 'Mínimo 6 caracteres';
    if (!confirmPassword)
      e.confirmPassword = 'Confirma tu nueva contraseña';
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

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        // El backend espera: { token: string, password: string }
        // y responde: { ok: true, msg: string } o { ok: false, msg: string }
      });

      const data = await res.json();

      if (!res.ok) {
        // 400 → token expirado o inválido
        setErrors({ general: data.msg || 'El enlace ha expirado o no es válido' });
        setStage('error');
        return;
      }

      setStage('success');
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch {
      setErrors({ general: 'Error de red. Intenta de nuevo.' });
      setStage('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ── Panel izquierdo ──────────────────────────────────────────────── */}
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
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          paddingLeft: '10%', paddingRight: '10%',
        }}>
          <div style={{ textAlign: 'left', maxWidth: '550px' }}>
            <h1 className="login-hero" style={{ margin: 0, lineHeight: '1.2' }}>
              Nueva contraseña, acceso seguro
            </h1>
            <p className="login-sub" style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
              Elige una contraseña fuerte para proteger tu cuenta de CX Dtec.
            </p>
          </div>
        </div>

        <footer className="login-footer">
          © {new Date().getFullYear()} CX Dtec Inc. Todos los derechos reservados.
        </footer>
      </div>

      {/* ── Panel derecho ────────────────────────────────────────────────── */}
      <div className="login-right" style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f8fafc',
      }}>
        <div className="login-card" style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: '#ffffff', padding: '2.5rem',
          borderRadius: '16px', border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        }}>

          {/* ── Etapa: formulario ── */}
          {stage === 'form' && (
            <>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: '#e6f4f7', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="8" width="14" height="10" rx="2"
                    stroke="#0d5c73" strokeWidth="1.5"/>
                  <path d="M7 8V6a3 3 0 0 1 6 0v2"
                    stroke="#0d5c73" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="13" r="1.2" fill="#0d5c73"/>
                </svg>
              </div>

              <h2 className="login-card__title">Restablecer contraseña</h2>
              <p className="login-card__sub">Por favor, ingresa tu nueva clave de acceso.</p>

              <form onSubmit={handleSubmit} noValidate className="login-form">

                {/* Nueva contraseña */}
                <div className="lf-field">
                  <label htmlFor="rp-password">Nueva contraseña</label>
                  <div className={`lf-input-wrap ${errors.password ? 'is-error' : ''}`}>
                    <input
                      id="rp-password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
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

                {/* ── Medidor de fuerza ── */}
                {password.length > 0 && (
                  <div style={{ marginTop: '-0.25rem', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', gap: '4px', height: '5px' }}>
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} style={{
                          flex: 1, borderRadius: '99px',
                          background: strength >= level
                            ? strengthColor[strength]
                            : '#e5e7eb',
                          transition: 'background 0.2s',
                        }} />
                      ))}
                    </div>
                    <p style={{
                      fontSize: '11px', marginTop: '5px',
                      fontWeight: 600, letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: strength > 0 ? strengthColor[strength] : '#9ca3af',
                    }}>
                      {strength > 0 ? `Seguridad ${strengthLabel[strength]}` : 'Escribe tu contraseña'}
                    </p>
                  </div>
                )}

                {/* Confirmar contraseña */}
                <div className="lf-field">
                  <label htmlFor="rp-confirm">Confirmar contraseña</label>
                  <div className={`lf-input-wrap ${errors.confirmPassword ? 'is-error' : ''}`}>
                    <input
                      id="rp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
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

                {errors.general && (
                  <div className="lf-general-error">{errors.general}</div>
                )}

                <button type="submit" className="lf-submit"
                  disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                  {isLoading ? 'Actualizando...' : 'Actualizar contraseña →'}
                </button>
              </form>

              <p className="login-card__contact" style={{ marginTop: '1.5rem' }}>
                <Link to="/login"
                  style={{ color: '#0d5c73', fontWeight: 600, textDecoration: 'none' }}>
                  ← Volver al login
                </Link>
              </p>
            </>
          )}

          {/* ── Etapa: éxito ── */}
          {stage === 'success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#e6f4f7', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7"
                    stroke="#0d5c73" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="login-card__title" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                ¡Contraseña actualizada!
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Tu contraseña ha sido restablecida correctamente.
                En unos segundos serás redirigido al login.
              </p>
              <Link to="/login" style={{
                display: 'inline-block', background: '#0d5c73',
                color: '#fff', padding: '0.75rem 2rem',
                borderRadius: '10px', fontWeight: 600,
                fontSize: '0.9rem', textDecoration: 'none',
              }}>
                Ir al login
              </Link>
            </div>
          )}

          {/* ── Etapa: error (token expirado) ── */}
          {stage === 'error' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#fef2f2', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5M12 16h.01"
                    stroke="#dc2626" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9"
                    stroke="#dc2626" strokeWidth="2"/>
                </svg>
              </div>
              <h2 className="login-card__title"
                style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#dc2626' }}>
                Enlace inválido o expirado
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {errors.general || 'Este enlace ya no es válido. Puedes solicitar uno nuevo desde la pantalla de recuperación.'}
              </p>
              <Link to="/forgot-password" style={{
                display: 'inline-block', background: '#0d5c73',
                color: '#fff', padding: '0.75rem 2rem',
                borderRadius: '10px', fontWeight: 600,
                fontSize: '0.9rem', textDecoration: 'none',
              }}>
                Solicitar nuevo enlace
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;