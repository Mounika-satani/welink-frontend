import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTrendingStartups } from '../service/startup';
import './Trending.css';



const Trending = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getTrendingStartups(9)
            .then(setStartups)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} className="mb-3" />
                <p className="text-muted">Loading trending startups...</p>
            </div>
        </div>
    );

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <p className="text-danger mb-3">⚠️ {error}</p>
                <button className="btn btn-outline-light btn-sm" onClick={() => window.location.reload()}>Retry</button>
            </div>
        </div>
    );

    // ── Empty state ────────────────────────────────────────────────────────────
    if (startups.length === 0) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <p className="text-muted">No trending startups yet. Check back soon!</p>
            </div>
        </div>
    );

    return (
        <div className="trending-page">
            <Container>
                <div className="trending-header mb-5">
                    <h1>Trending</h1>
                    <p>Startups gaining the most momentum this week — by views, upvotes, and growth velocity.</p>
                </div>

                <Row className="g-4">
                    {startups.map((startup, index) => {
                        const metrics = startup.metrics || {};
                        const rank = index + 1;

                        // Pick the best available image
                        const heroImage = startup.logo_url
                            || startup.posts?.[0]?.media_url
                            || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;

                        return (
                            <Col lg={4} md={6} sm={12} key={startup.id}>
                                <Link to={`/startup/${startup.id}`} className="text-decoration-none">
                                    <Card className="trending-grid-card border-0 text-white">
                                        {startup.logo_url ? (
                                            <Card.Img
                                                src={heroImage}
                                                alt={startup.name}
                                                className="trending-img"
                                                onError={e => {
                                                    e.target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;
                                                }}
                                            />
                                        ) : (
                                            <div className="trending-img d-flex align-items-center justify-content-center"
                                                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', fontSize: '4rem', fontWeight: 700, color: '#ff3366' }}>
                                                {startup.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div className="trending-overlay">
                                            <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                <div className="rank-badge">#{rank}</div>
                                                <div className="trending-score-badge">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C12 2 12 6 10 8C8 10 5 11 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 11 15 2 12 2ZM12 19C10.343 19 9 17.657 9 16C9 14 11 12 12 10C13 12 15 14 15 16C15 17.657 13.657 19 12 19Z" />
                                                    </svg>
                                                    {(metrics.trending_score ?? 0).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="trending-content p-4 mt-auto w-100">
                                                <div className="hot-tag mb-1">Hot Right Now</div>
                                                <Card.Title className="fw-bold mb-1 fs-5 text-truncate">{startup.name}</Card.Title>
                                                <Card.Text className="small text-white-75 mb-3 text-truncate">
                                                    {startup.tagline || startup.description || '—'}
                                                </Card.Text>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-3 text-white-50 small fw-medium">
                                                    </div>

                                                    <div className="arrow-icon">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                                            <polyline points="7 7 17 7 17 17"></polyline>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </div>
    );
};

export default Trending;
