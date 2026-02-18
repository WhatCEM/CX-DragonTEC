import '../styles/pages.css';

const Dashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

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

            {import.meta.env.DEV && (
                <div className="dev-info">
                    <h4>Development Info</h4>
                    <p>
                        <strong>API URL:</strong> {apiUrl || 'Not configured'}
                    </p>
                    <p>
                        <strong>Mode:</strong> {import.meta.env.MODE}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
