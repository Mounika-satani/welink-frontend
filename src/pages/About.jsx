import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Container>
                <div className="about-hero mb-5">
                    <h1 className="about-title text-white">
                        Built for Discovery, <br />
                        <span className="text-gradient">Designed for Impact</span>
                    </h1>
                    <p className="about-subtext">
                        We're not another directory. We're an editorial platform that tells the stories of AI's most promising ventures — curated with precision, presented with purpose.
                    </p>

                    <div className="stats-row mb-5">
                        <Row className="g-4 justify-content-center">
                            <Col md={4} sm={12}>
                                <div className="stat-card">
                                    <div className="stat-number">1,200+</div>
                                    <div className="stat-label">Startups featured</div>
                                </div>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="stat-card">
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Monthly Readers</div>
                                </div>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="stat-card">
                                    <div className="stat-number">150+</div>
                                    <div className="stat-label">Investors Connected</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="mission-section mb-5">
                    <div className="mission-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            <path d="M2 12h20"></path>
                        </svg>
                    </div>
                    <h2 className="mission-title text-white">Our Mission</h2>
                    <p className="mission-desc">
                        To surface the world's most innovative AI startups and give them the editorial spotlight they deserve. We believe the best ideas don't always have the biggest marketing budgets.
                    </p>
                </div>

                <div className="values-section pb-5">
                    <h2 className="values-title text-white mb-5">What we stand for</h2>
                    <Row className="g-4">
                        <Col md={6} lg={6}>
                            <Card className="value-card border-0 h-100">
                                <div className="value-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <h5 className="value-card-title">Discover Hidden Gems</h5>
                                <p className="value-card-text">
                                    Our editorial team curates and verifies every startup, ensuring you find truly innovative AI solutions — not just well-funded ones.
                                </p>
                            </Card>
                        </Col>

                        <Col md={6} lg={6}>
                            <Card className="value-card border-0 h-100">
                                <div className="value-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                    </svg>
                                </div>
                                <h5 className="value-card-title">Accelerate Innovation</h5>
                                <p className="value-card-text">
                                    We bridge the gap between visionary founders and early adopters, fostering an ecosystem where new technologies can thrive and scale rapidly.
                                </p>
                            </Card>
                        </Col>

                        <Col md={6} lg={6}>
                            <Card className="value-card border-0 h-100">
                                <div className="value-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <h5 className="value-card-title">Empower Founders</h5>
                                <p className="value-card-text">
                                    By providing a platform for visibility and connection, we empower founders to focus on what they do best: building the future.
                                </p>
                            </Card>
                        </Col>

                        <Col md={6} lg={6}>
                            <Card className="value-card border-0 h-100">
                                <div className="value-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="7"></circle>
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                                    </svg>
                                </div>
                                <h5 className="value-card-title">Curated Excellence</h5>
                                <p className="value-card-text">
                                    Quality over quantity. We prioritize substance and utility, ensuring our community has access to the most impactful tools and insights.
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default About;
