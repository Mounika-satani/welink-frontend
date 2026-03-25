import React from 'react';
import './LegalPage.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                <div className="legal-hero">
                    <div className="legal-badge">Legal</div>
                    <h1 className="legal-title">Privacy <span className="highlight">Policy</span></h1>
                    <p className="legal-subtitle">
                        At CommunEdge, protecting your data is integral to maintaining a high-trust ecosystem across our 1,200+ startups, 50K+ monthly users, and 150+ investors and operators.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">1</span> Overview</div>
                    <p>
                        At CommunEdge, we support 1,200+ startups, engage 50K+ monthly users, and collaborate with 150+ investors and operators. Protecting your data is integral to maintaining a high-trust ecosystem.
                    </p>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">2</span> Data We Collect</div>
                    <p>We collect only what is necessary to deliver high-quality outcomes:</p>
                    <ul>
                        <li>Personal Information: Name, email, phone, role, company</li>
                        <li>Startup Intelligence: Pitch decks, financial models, market data, validation inputs</li>
                        <li>Technical Data: IP address, device type, session activity across 50K+ monthly interactions</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">3</span> Purpose of Use</div>
                    <p>Your data is used to:</p>
                    <ul>
                        <li>Enable high-precision matching between startups, investors, and mentors</li>
                        <li>Facilitate 100+ curated introductions per month</li>
                        <li>Improve platform performance and decision-making insights</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">4</span> Data Sharing</div>
                    <p>Data is shared selectively within our verified network of 150+ investors and experts.</p>
                    <ul>
                        <li>No open marketplace exposure</li>
                        <li>No third-party selling of personal or startup data</li>
                    </ul>
                </div>

                <div className="legal-section">
                    <div className="legal-section-title"><span className="section-num">5</span> Your Rights</div>
                    <p>You may request:</p>
                    <ul>
                        <li>Data access, correction, or deletion</li>
                        <li>Withdrawal of consent</li>
                    </ul>
                    <p style={{ marginTop: '12px' }}>
                        Contact: <a href="mailto:weiteredge240@gmail.com" className="legal-contact-link">weiteredge240@gmail.com</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicy;
