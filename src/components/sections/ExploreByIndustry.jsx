import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../service/category';
import './ExploreByIndustry.css';

// The pink shield icon used in Industries.jsx


const ExploreByIndustry = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                if (Array.isArray(data)) {
                    // Process categories to trim names and filter out invalid ones
                    const processed = data
                        .filter(c => c.name)
                        .map(c => ({
                            ...c,
                            name: c.name.trim(),
                            finalImage: c.imageUrl || c.image_url
                        }))
                        .slice(0, 8);
                    setCategories(processed);
                }
            } catch (err) {
                console.error('Home Industries Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // If no categories are loaded, we hide the section entirely to avoid a blank space
    if (loading) return (
        <section className="explore-industry-section py-5">
            <Container className="px-5 text-center">
                <Spinner animation="border" style={{ color: '#ec4899' }} />
            </Container>
        </section>
    );

    if (categories.length === 0) return null;

    return (
        <section className="explore-industry-section py-5">
            <Container className="px-5">
                <div className="text-center mb-5">
                    <h6 className="text-primary text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Browse Categories</h6>
                    <h2 className="section-title mb-3">Explore by Industry</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.7)' }}>
                        Find AI startups transforming specific sectors and solving industry-specific challenges.
                    </p>
                </div>

                <Row className="g-4">
                    {categories.map((category, idx) => (
                        <Col lg={3} md={6} sm={12} key={category.id || idx}>
                            <Card
                                className="industry-card"
                                onClick={() => navigate('/discover', { state: { category: category.name } })}
                            >
                                {category.finalImage ? (
                                    <img src={category.finalImage} alt={category.name} className="industry-bg-img" />
                                ) : (
                                    <div className="industry-bg-placeholder" />
                                )}
                                <div className="industry-overlay">

                                    <div className="industry-content">
                                        <h3 className="industry-title text-truncate">{category.name}</h3>
                                        <p className="industry-desc text-truncate">
                                            {category.description || `Discover startups in ${category.name}.`}
                                        </p>
                                        <div className="industry-link-custom">
                                            {category.startupCount || 0} {category.startupCount === 1 ? 'Startup' : 'Startups'}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default ExploreByIndustry;
