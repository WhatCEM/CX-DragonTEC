import { Link } from 'react-router-dom';
import '../styles/pages.css';

const NotFound = () => {
    return (
        <div className="page not-found-page">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="back-home-btn">
                    Go back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
