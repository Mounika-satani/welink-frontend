import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './FeaturedStartups.css';

const FeaturedStartups = () => {
    return (
        <section className="featured-startups-section py-5">
            <Container className="px-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h6 className="text-primary text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Curated Selection</h6>
                        <h2 className="section-title mb-0">Featured Startups</h2>
                    </div>
                    <Link to="/startups" className="view-all-link text-decoration-none text-white d-flex align-items-center">
                        View all startups
                        <span className="ms-2">↗</span>
                    </Link>
                </div>

                <Row className="g-4">
                    {/* Main Large Card (Left) */}
                    <Col lg={7} md={12}>
                        <div className="startup-card main-card">
                            <img
                                src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200"
                                alt="NeuralFlow Main"
                                className="card-bg-img"
                            />
                            <div className="card-overlay">
                                <div className="card-tags">
                                    <Badge bg="transparent" className="custom-badge backdrop-blur">Featured</Badge>
                                    <Badge bg="transparent" className="custom-badge backdrop-blur ms-2">Infrastructure</Badge>
                                </div>
                                <div className="card-content">
                                    <h3 className="startup-name">NeuralFlow</h3>
                                    <p className="startup-description">Enterprise AI infrastructure that powers your ambitions.</p>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column (Stacked Cards) */}
                    <Col lg={5} md={12}>
                        <div className="d-flex flex-column gap-4 h-100">
                            {/* Top Small Card */}
                            <div className="startup-card small-card">
                                <img
                                    src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800"
                                    alt="CodeScreen"
                                    className="card-bg-img"
                                />
                                <div className="card-overlay">
                                    <div className="card-tags">
                                        <Badge bg="transparent" className="custom-badge backdrop-blur">Featured</Badge>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="startup-name fs-4">CodeSynth</h3>
                                        <p className="startup-description small">Next-gen code generation platform.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Small Card */}
                            <div className="startup-card small-card">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    alt="TeamWork"
                                    className="card-bg-img"
                                />
                                <div className="card-overlay">
                                    <div className="card-tags">
                                        <Badge bg="transparent" className="custom-badge backdrop-blur">Featured</Badge>
                                        <Badge bg="transparent" className="custom-badge backdrop-blur ms-2">Collaboration</Badge>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="startup-name fs-4">SyncSpace</h3>
                                        <p className="startup-description small">Virtual office for remote teams.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default FeaturedStartups;
