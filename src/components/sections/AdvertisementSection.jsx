import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getAllCategories } from '../../service/category';
import './AdvertisementSection.css';

const AdvertisementSection = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await getAllCategories();
                if (Array.isArray(data)) {
                    const filteredAds = data.filter(c =>
                        c.type === 'ADVERTISEMENT' ||
                        c.name.toUpperCase() === 'ADVERTISEMENT'
                    );
                    setAds(filteredAds);
                }
            } catch (err) {
                console.error('Advertisement Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    if (loading || ads.length === 0) return null;

    return (
        <section className="advertisement-section py-5">
            <Container>
                <div className="text-center mb-4">
                    <h6 className="text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>Promotions</h6>
                    <h2 className="section-title">Special Offers</h2>
                </div>
                <Row className="g-4">
                    {ads.map((ad, idx) => (
                        <Col lg={6} md={12} key={ad.id || idx}>
                            <Card className="ad-card">
                                <Row className="g-0 align-items-center">
                                    <Col sm={5}>
                                        <div className="ad-img-wrapper">
                                            <img src={ad.imageUrl || ad.image_url} alt={ad.name} className="ad-img" />
                                        </div>
                                    </Col>
                                    <Col sm={7}>
                                        <Card.Body>
                                            <h4 className="ad-title">{ad.name}</h4>
                                            <p className="ad-text">{ad.description || 'Check out this featured spotlight.'}</p>
                                            <button className="btn btn-outline-primary btn-sm rounded-pill px-4">Learn More</button>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default AdvertisementSection;
