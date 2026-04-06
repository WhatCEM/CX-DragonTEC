import { useState } from 'react';
import '../styles/pages.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [status, setStatus] = useState<null | {
    servidor: string;
    base_de_datos: string;
    timestamp: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch(`${apiUrl}/status`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page dashboard-page">
      <h2>Dashboard</h2>
      <p className="page-description">
        Bienvenido a tu dashboard. Este será tu centro de control principal.
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Stats</h3>
          <div className="stat-value">--</div>
          <p className="stat-label">Coming soon</p>
        </div>
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="stat-value">--</div>
          <p className="stat-label">Coming soon</p>
        </div>
        <div className="dashboard-card">
          <h3>Notifications</h3>
          <div className="stat-value">--</div>
          <p className="stat-label">Coming soon</p>
        </div>
        <div className="dashboard-card">
          <h3>Performance</h3>
          <div className="stat-value">--</div>
          <p className="stat-label">Coming soon</p>
        </div>
      </div>

      {/* Botón de prueba de conexión */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={checkConnection} disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar conexión'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ Error: {error}</p>}

        {status && (
          <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            <p>🟢 Servidor: <strong>{status.servidor}</strong></p>
            <p>🗄️ MongoDB: <strong>{status.base_de_datos}</strong></p>
            <p>🕐 Timestamp: <strong>{status.timestamp}</strong></p>
          </div>
        )}
      </div>

      {import.meta.env.DEV && (
        <div className="dev-info">
          <h4>Development Info</h4>
          <p><strong>API URL:</strong> {apiUrl || 'Not configured'}</p>
          <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;