import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const API_URL = import.meta.env.VITE_API_URL;

type Stage = 'form' | 'sent';

const ForgotPassword = () => {
  const [email, setEmail]         = useState('');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage]         = useState<Stage>('form');

  const validate = (): boolean => {
    if (!email.trim()) { setError('El correo es obligatorio'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Formato de correo inválido'); return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // POST /api/auth/forgot-password → { email }
      // El back responde 200 si el correo existe, 404 si no.
      // En ambos casos mostramos confirmación genérica (seguridad UX).
      await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Error de red: igualmente mostramos confirmación genérica
    } finally {
      setIsLoading(false);
      setStage('sent');
    }
  };

  return (
    <div className="login-root">

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
              Tu acceso, siempre bajo control
            </h1>
            <p className="login-sub" style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
              Recupera el acceso a tu cuenta de forma segura en segundos.
            </p>
          </div>
        </div>
        <footer className="login-footer">
          © {new Date().getFullYear()} CX Dtec Inc. Todos los derechos reservados.
        </footer>
      </div>

      <div className="login-right" style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f8fafc',
      }}>
        <div className="login-card" style={{
          width: '100%', maxWidth: '440px', backgroundColor: '#ffffff',
          padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        }}>

          {stage === 'form' && (
            <>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: '#e6f4f7', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="8" width="14" height="10" rx="2" stroke="#0d5c73" strokeWidth="1.5"/>
                  <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="#0d5c73" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="13" r="1.2" fill="#0d5c73"/>
                </svg>
              </div>

              <h2 className="login-card__title">¿Olvidaste tu contraseña?</h2>
              <p className="login-card__sub">
                Ingresa tu correo y te enviaremos un enlace para restablecerla.
              </p>

              <form onSubmit={handleSubmit} noValidate className="login-form">
                <div className="lf-field">
                  <label htmlFor="fp-email">Correo electrónico</label>
                  <div className={`lf-input-wrap ${error ? 'is-error' : ''}`}>
                    <input id="fp-email" type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="nombre@empresa.com"
                      autoComplete="email" disabled={isLoading}/>
                    <span className="lf-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="3" width="14" height="10" rx="2"
                          stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M1.5 4.5L8 9.5L14.5 4.5"
                          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                  {error && <span className="lf-error">{error}</span>}
                </div>

                <button type="submit" className="lf-submit"
                  disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                  {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación →'}
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

          {stage === 'sent' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: '#e6f4f7', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#0d5c73" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="login-card__title" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Revisa tu correo
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Si <strong style={{ color: '#374151' }}>{email}</strong> está registrado,
                recibirás un enlace de recuperación en los próximos minutos.
                Revisa también tu carpeta de spam.
              </p>
              <Link to="/login" style={{
                display: 'inline-block', background: '#0d5c73', color: '#fff',
                padding: '0.75rem 2rem', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              }}>
                Volver al login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;