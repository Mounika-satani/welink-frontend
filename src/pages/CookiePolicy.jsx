import React from 'react';
import './LegalPage.css';

const CookiePolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-hero">
                    <div className="legal-badge">Legal</div>
                    <h1 className="legal-title">Cookie <span className="highlight">Policy</span></h1>
                    <p className="legal-subtitle">
                        To deliver a seamless experience across 50K+ monthly users, we use cookies and similar technologies.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">1</span> Overview</div>
                    <p>
                        To deliver a seamless experience across 50K+ monthly users, we use cookies and similar technologies.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">2</span> Why We Use Cookies</div>
                    <p>Cookies help us:</p>
                    <ul>
                        <li>Maintain secure sessions across thousands of active users daily</li>
                        <li>Analyze engagement across 1,200+ startup profiles and interactions</li>
                        <li>Optimize user journeys and platform performance</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">3</span> Types of Cookies</div>
                    <ul>
                        <li><strong style={{ color: '#fff' }}>Essential Cookies:</strong> Enable login, security, and core functionality</li>
                        <li><strong style={{ color: '#fff' }}>Performance Cookies:</strong> Track usage trends, engagement metrics, and platform efficiency</li>
                        <li><strong style={{ color: '#fff' }}>Functional Cookies:</strong> Store user preferences and personalized experiences</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">4</span> Third-Party Integrations</div>
                    <p>We may use trusted tools (analytics, CRM systems) to support:</p>
                    <ul>
                        <li>Performance tracking</li>
                        <li>Ecosystem insights</li>
                        <li>Communication efficiency</li>
                    </ul>
                    <p style={{ marginTop: '10px' }}>All integrations are selected under strict data compliance standards.</p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">5</span> Control & Preferences</div>
                    <p>
                        Users can manage cookies via browser settings. Disabling cookies may impact core platform features and personalization.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">6</span> Contact</div>
                    <p>
                        For queries or requests: <a href="mailto:support@communedge.com" className="legal-contact-link">support@communedge.com</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CookiePolicy;
