import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../service/category';
import './Industries.css';



const Industries = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllCategories();
                setCategories(data.filter(c => c.type === 'INDUSTRY' || !c.type));
                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="industries-page d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="pink" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="industries-page">
                <Container className="py-5">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </div>
        );
    }

    return (
        <div className="industries-page">
            <Container>
                <div className="industries-header mb-5">
                    <h1>Explore by Industry</h1>
                    <p>Discover AI startups transforming every sector — from healthcare to fintech, creative tools to enterprise infrastructure.</p>
                </div>

                <Row className="g-4">
                    {categories.length === 0 ? (
                        <Col xs={12}>
                            <p className="text-center text-muted">No categories found.</p>
                        </Col>
                    ) : (
                        categories.map((category) => (
                            <Col lg={4} md={6} sm={12} key={category.id}>
                                <Card className="industry-grid-card">
                                    {category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="industry-bg-img" />
                                    ) : (
                                        <div className="industry-bg-placeholder" />
                                    )}
                                    <div className="industry-overlay">


                                        <div className="industry-content">
                                            <h3 className="industry-title text-truncate">{category.name}</h3>
                                            <p className="industry-desc text-truncate">{category.description || `Discover startups in ${category.name}.`}</p>
                                            <button
                                                className="industry-link"
                                                onClick={() => navigate('/discover', { state: { category: category.name } })}
                                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                            >
                                                {category.startupCount || 0} {category.startupCount === 1 ? 'Startup' : 'Startups'}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Industries;
