import '../styles/pages.css';

const About = () => {
    return (
        <div className="page about-page">
            <h2>About</h2>
            <p className="page-description">
                Learn more about this application and the team behind it.
            </p>

            <section className="about-section">
                <h3>Project Overview</h3>
                <p>
                    DtechCX Front is a modern React application built with Vite, TypeScript,
                    and React Router. It's designed to be scalable, maintainable, and easy
                    to deploy across different environments.
                </p>
            </section>

            <section className="about-section">
                <h3>Tech Stack</h3>
                <ul className="tech-list">
                    <li>React 19</li>
                    <li>TypeScript</li>
                    <li>Vite</li>
                    <li>React Router v7</li>
                    <li>pnpm</li>
                    <li>Docker</li>
                </ul>
            </section>

            <section className="about-section">
                <h3>Version</h3>
                <p>
                    <strong>App Version:</strong> {import.meta.env.VITE_APP_VERSION || '0.0.0'}
                </p>
            </section>
        </div>
    );
};

export default About;
