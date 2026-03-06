import React, { useState, useEffect } from 'react';
import { Container, Carousel, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTrendingStartups } from '../../service/startup';
import './TrendingThisWeek.css';



const TrendingThisWeek = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerSlide = 4;

    useEffect(() => {
        getTrendingStartups(8)
            .then(setStartups)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const createSlidingWindow = (items, windowSize) => {
        if (!items || items.length === 0) return [];
        if (items.length <= windowSize) return [items];

        const windowedItems = [];
        for (let i = 0; i < items.length; i++) {
            const window = [];
            for (let j = 0; j < windowSize; j++) {
                window.push(items[(i + j) % items.length]);
            }
            windowedItems.push(window);
        }
        return windowedItems;
    };

    const slides = createSlidingWindow(startups, itemsPerSlide);

    if (loading) return (
        <section className="trending-section py-5">
            <Container className="px-5 text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} />
                <p className="text-muted mt-3">Loading trending...</p>
            </Container>
        </section>
    );

    if (error || startups.length === 0) return null;

    return (
        <section className="trending-section py-5">
            <Container className="px-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h6 className="text-primary text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Hot Right Now</h6>
                        <h2 className="section-title mb-0">Trending This Week</h2>
                    </div>
                    <Link to="/trending" className="view-all-link text-decoration-none text-white d-flex align-items-center">
                        See all trending
                        <span className="ms-2">↗</span>
                    </Link>
                </div>

                <Carousel indicators={false} interval={5000} className="trending-carousel">
                    {slides.map((slide, slideIndex) => (
                        <Carousel.Item key={`trending-slide-${slideIndex}`}>
                            <Row className="g-4">
                                {slide.map((startup, idx) => {

                                    const actualIndex = startups.findIndex(s => s.id === startup.id);
                                    const rank = actualIndex + 1;

                                    const heroImage = startup.logo_url
                                        || startup.posts?.[0]?.media_url
                                        || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;

                                    return (
                                        <Col lg={3} md={6} sm={12} key={`${startup.id}-${slideIndex}-${idx}`}>
                                            <Link to={`/startup/${startup.id}`} className="text-decoration-none">
                                                <Card className="trending-card border-0 text-white">
                                                    <Card.Img
                                                        src={heroImage}
                                                        alt={startup.name}
                                                        className="trending-img"
                                                        onError={e => {
                                                            e.target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;
                                                        }}
                                                    />
                                                    <div className="trending-overlay">
                                                        <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                            <div className="rank-badge">#{rank}</div>
                                                            <div className="d-flex flex-column gap-2 text-end">
                                                            </div>
                                                        </div>

                                                        <div className="trending-content p-3 mt-auto w-100">
                                                            <div className="hot-tag mb-1">Hot Right Now</div>
                                                            <Card.Title className="fw-bold mb-1 fs-6 text-truncate">{startup.name}</Card.Title>
                                                            <Card.Text className="small text-white-50 text-truncate">
                                                                {startup.tagline || startup.description || '—'}
                                                            </Card.Text>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default TrendingThisWeek;
