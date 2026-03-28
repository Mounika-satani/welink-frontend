import React from 'react';
import './LegalPage.css';

const About = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">

                {/* Hero */}
                <div className="legal-hero">
                    <div className="legal-badge">About CommunEdge</div>
                    <h1 className="legal-title">
                        Built for Founders,<br />
                        <span className="highlight">Designed for Growth</span>
                    </h1>
                    <p className="legal-subtitle">
                        We are a full-stack incubation ecosystem that supports startups through every phase of their journey, from idea validation to growth and beyond.
                        We don't just feature startups — we partner with them, guiding, mentoring, and connecting them with the right people, capital, and opportunities.
                    </p>
                </div>

                {/* Stats */}
                <div className="about-stats-row">
                    <div className="about-stat-card">
                        <div className="about-stat-number">1,200+</div>
                        <div className="about-stat-label">Startups Supported</div>
                    </div>
                    <div className="about-stat-card">
                        <div className="about-stat-number">50K+</div>
                        <div className="about-stat-label">Founder & Ecosystem Reach</div>
                    </div>
                    <div className="about-stat-card">
                        <div className="about-stat-number">150+</div>
                        <div className="about-stat-label">Investors & Mentors Network</div>
                    </div>
                </div>

                {/* Mission */}
                <div className="legal-section">
                    <div className="legal-section-title">
                        <span>Our Mission</span>
                    </div>
                    <p>
                        Our mission is to enable visionary founders by providing end-to-end support through every phase of their journey, from pre-seed to scale and beyond.
                        Our mission is based on the understanding that great ideas need everything — from right guidance, validation, network and funding — to succeed.
                    </p>
                </div>

                {/* Values */}
                <div className="legal-section">
                    <div className="legal-section-title">
                        <span>What We Stand For</span>
                    </div>
                    <div className="about-values-grid" style={{ marginTop: '16px' }}>
                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <div className="about-value-title">Validate & Build Strong Foundations</div>
                            <p className="about-value-text">We help founders refine and validate their ideas, ensuring they build solutions that solve real-world problems, not just great businesses.</p>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </div>
                            <div className="about-value-title">Accelerate Growth & Funding</div>
                            <p className="about-value-text">From pitch decks to investor meetings, we actively help startups get the funding they need through every phase — from pre-seed, angel, seed, and beyond.</p>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="about-value-title">Empower Founders with Mentorship</div>
                            <p className="about-value-text">We connect founders with mentors and industry experts who help them navigate every challenge and strategic decision.</p>
                        </div>
                        <div className="about-value-card">
                            <div className="about-value-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                            <div className="about-value-title">Lifelong Partnership</div>
                            <p className="about-value-text">Our value doesn't peak at funding — it compounds over time. As your company evolves, so does our support. We bring sharper strategy, deeper connections, and continuous leverage when it matters most.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
