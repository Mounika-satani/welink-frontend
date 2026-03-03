import React from 'react';
import { Container, Carousel, Row, Col, Card } from 'react-bootstrap';
import './FeatureThisWeek.css';

const features = [
    {
        id: 1,
        title: "NeuralFlow",
        category: "AI Infrastructure",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        icon: "N"
    },
    {
        id: 2,
        title: "QuantumLeap",
        category: "Quantum Computing",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
        icon: "Q"
    },
    {
        id: 3,
        title: "CyberShield",
        category: "Cybersecurity",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        icon: "C"
    },
    {
        id: 4,
        title: "BioSynth",
        category: "Biotech",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
        icon: "B"
    },
    {
        id: 5,
        title: "EcoSmart",
        category: "Green Tech",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?auto=format&fit=crop&q=80&w=800",
        icon: "E"
    },
    {
        id: 6,
        title: "RoboAssist",
        category: "Robotics",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        icon: "R"
    },
    {
        id: 7,
        title: "DataMinds",
        category: "Big Data",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        icon: "D"
    },
    {
        id: 8,
        title: "SpaceXplore",
        category: "Aerospace",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        icon: "S"
    }
];

const risingStars = [
    {
        id: 101,
        title: "AlphaCode",
        category: "Dev Tools",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
        icon: "A"
    },
    {
        id: 102,
        title: "BetaHealth",
        category: "HealthTech",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
        icon: "B"
    },
    {
        id: 103,
        title: "GammaRay",
        category: "Energy",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
        icon: "G"
    },
    {
        id: 104,
        title: "DeltaForce",
        category: "Logistics",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
        icon: "D"
    },
    {
        id: 105,
        title: "EpsilonEdu",
        category: "EdTech",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
        icon: "E"
    },
    {
        id: 106,
        title: "ZetaFinance",
        category: "FinTech",
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=800",
        icon: "Z"
    }
];

const FeatureThisWeek = () => {
    // Show 4 items at a time
    const itemsPerSlide = 4;

    // Create a sliding window of items that wraps around
    // This allows moving 1 item "forward" per slide, while showing 4 full items
    const createSlidingWindow = (items, windowSize) => {
        if (items.length === 0) return [];
        const windowedItems = [];
        for (let i = 0; i < items.length; i++) {
            const window = [];
            for (let j = 0; j < windowSize; j++) {
                // Wrap around using modulo
                window.push(items[(i + j) % items.length]);
            }
            windowedItems.push(window);
        }
        return windowedItems;
    };

    const featureSlides = createSlidingWindow(features, itemsPerSlide);
    const risingStarSlides = createSlidingWindow(risingStars, itemsPerSlide);

    const renderCarousel = (slides, idPrefix) => (
        <Carousel indicators={false} interval={null} className="feature-carousel px-4">
            {slides.map((slide, slideIndex) => (
                <Carousel.Item key={`${idPrefix}-slide-${slideIndex}`}>
                    <Row className="g-4">
                        {slide.map((item, itemIndex) => (
                            <Col md={3} sm={6} xs={12} key={`${idPrefix}-${slideIndex}-${item.id}`}>
                                <Card className="feature-card border-0 text-white">
                                    <Card.Img src={item.image} alt={item.title} className="feature-img" />
                                    <div className="card-img-overlay d-flex flex-column justify-content-end">
                                        <div className="feature-content glass-effect p-3 rounded">
                                            <div className="d-flex align-items-center">
                                                <div className="feature-icon-wrapper me-3">
                                                    <span className="feature-icon">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <Card.Title className="mb-0 fw-bold fs-6">{item.title}</Card.Title>
                                                    <Card.Text className="small text-light-50" style={{ fontSize: '0.8rem' }}>{item.category}</Card.Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    );

    return (
        <section className="feature-section py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 px-4">
                    <h2 className="section-title">Feature <span className="text-highlight">This Week</span></h2>
                </div>
                {renderCarousel(featureSlides, 'feature')}

                <div className="mt-5 pt-3 mb-4 px-4">
                    <h2 className="section-title">Rising <span className="text-highlight">Stars</span></h2>
                </div>
                {renderCarousel(risingStarSlides, 'rising')}
            </Container>
        </section>
    );
};

export default FeatureThisWeek;
