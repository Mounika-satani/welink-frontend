import React from 'react';
import { Container, Carousel, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './TrendingThisWeek.css';

const trendingStartups = [
    {
        id: 1,
        rank: 1,
        name: "DataWeave",
        description: "Semantic data pipeline for LLMs",
        views: "12.4k",
        likes: "847",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        rank: 2,
        name: "NebulaAI",
        description: "Generative art for enterprise",
        views: "899k",
        likes: "500",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        rank: 3,
        name: "CodeFlow",
        description: "Automated PR reviews",
        views: "100k",
        likes: "485",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        rank: 4,
        name: "BioSense",
        description: "AI-driven health monitoring",
        views: "75k",
        likes: "320",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        rank: 5,
        name: "UrbanSky",
        description: "Drone logistics network",
        views: "50k",
        likes: "210",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800"
    }
];

const TrendingThisWeek = () => {
    // Show 4 items at a time
    const itemsPerSlide = 4;

    const createSlidingWindow = (items, windowSize) => {
        if (items.length === 0) return [];
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

    const slides = createSlidingWindow(trendingStartups, itemsPerSlide);

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

                <Carousel indicators={false} interval={null} className="trending-carousel">
                    {slides.map((slide, slideIndex) => (
                        <Carousel.Item key={`trending-slide-${slideIndex}`}>
                            <Row className="g-4">
                                {slide.map((startup) => (
                                    <Col lg={3} md={6} sm={12} key={startup.id}>
                                        <Card className="trending-card border-0 text-white">
                                            <Card.Img src={startup.image} alt={startup.name} className="trending-img" />
                                            <div className="trending-overlay">
                                                <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                    <div className="rank-badge">#{startup.rank}</div>
                                                    <div className="d-flex flex-column gap-2">
                                                        <div className="stat-badge">
                                                            <span>👁 {startup.views}</span>
                                                        </div>
                                                        <div className="stat-badge">
                                                            <span>🔥 {startup.likes}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="trending-content p-3 mt-auto w-100">
                                                    <div className="hot-tag mb-1">Hot Right Now</div>
                                                    <Card.Title className="fw-bold mb-1">{startup.name}</Card.Title>
                                                    <Card.Text className="small text-white-50">{startup.description}</Card.Text>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default TrendingThisWeek;
