import React, { useState, useEffect } from 'react';
import { Container, Carousel, Row, Col, Card, Spinner } from 'react-bootstrap';
import { getAllPosts } from '../../service/post';
import { useAuth } from '../../context/AuthContext';
import './FeatureThisWeek.css';

const FeatureThisWeek = () => {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const itemsPerSlide = 3;

    useEffect(() => {
        getAllPosts(token)
            .then(data => {
                if (Array.isArray(data)) {
                    const recentPosts = data
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 8);

                    const mappedFeatures = recentPosts.map(post => ({
                        id: post.id,
                        title: post.startup?.name || "New Startup",
                        category: post.startup?.category || post.title || "Innovation",
                        image: (post.media_urls && post.media_urls[0]) || post.media_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
                        icon: (post.startup?.name && post.startup.name[0]) || "W"
                    }));
                    setPosts(mappedFeatures);
                }
            })
            .catch(err => console.error("Feature Fetch Error:", err))
            .finally(() => setLoading(false));
    }, [token]);

    const createSlidingWindow = (items, windowSize) => {
        if (items.length === 0) return [];
        if (items.length <= windowSize) {
            return [items];
        }
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

    const featureSlides = createSlidingWindow(posts, itemsPerSlide);

    if (loading) return (
        <section className="feature-section py-5">
            <Container className="text-center">
                <Spinner animation="border" style={{ color: '#ec4899' }} />
            </Container>
        </section>
    );

    if (posts.length === 0) return null;

    return (
        <section className="feature-section py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 px-4">
                    <h2 className="section-title">Feature <span className="text-highlight">This Week</span></h2>
                </div>

                <Carousel indicators={false} interval={5000} className="feature-carousel px-4">
                    {featureSlides.map((slide, slideIndex) => (
                        <Carousel.Item key={`feature-slide-${slideIndex}`}>
                            <Row className="g-4">
                                {slide.map((item) => (
                                    <Col md={4} sm={6} xs={12} key={`feature-${slideIndex}-${item.id}`} className="d-flex align-items-stretch">
                                        <Card className="feature-card border-0 text-white w-100">
                                            <div className="feature-img-container">
                                                <img src={item.image} alt="" className="feature-bg-blur" aria-hidden="true" />
                                                <Card.Img src={item.image} alt={item.title} className="feature-img-main" />
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

export default FeatureThisWeek;
