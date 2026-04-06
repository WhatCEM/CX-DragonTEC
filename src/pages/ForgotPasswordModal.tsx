// src/components/ForgotPasswordModal.tsx
import { useState, FormEvent } from 'react';
import '../styles/modal.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu correo electrónico' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Formato de correo inválido' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Aquí iría la llamada a tu API para recuperar contraseña
      // Por ahora simulamos una respuesta exitosa
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }

      setMessage({ 
        type: 'success', 
        text: 'Te hemos enviado un correo con instrucciones para recuperar tu contraseña' 
      });
      setEmail('');
      
      // Opcional: cerrar el modal después de 3 segundos
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 3000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error de red. Intenta de nuevo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Recuperar contraseña</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            ¿Olvidaste tu contraseña? Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
          </p>
          
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-field">
              <label htmlFor="reset-email">Correo electrónico</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            
            {message && (
              <div className={`modal-message modal-message--${message.type}`}>
                {message.text}
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="modal-btn modal-btn--secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="modal-btn modal-btn--primary"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;