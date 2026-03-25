import React, { useEffect, useState } from 'react';
import { Container, Badge } from 'react-bootstrap';
import { getAllCategories } from '../../service/category';
import './FeaturedStartups.css';

const FeaturedStartups = () => {
    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const data = await getAllCategories();
                if (Array.isArray(data)) {
                    const ads = data.filter(c =>
                        c.type === 'ADVERTISEMENT' ||
                        c.name.toUpperCase() === 'ADVERTISEMENT'
                    ).slice(0, 3); // Take exactly 3 for the new layout
                    setAdvertisements(ads);
                }
            } catch (err) {
                console.error('FeaturedAds fetch error:', err);
            }
        };
        fetchAds();
    }, []);

    if (advertisements.length === 0) return null;

    return (
        <section className="featured-startups-section py-5">
            <Container>
                <div className="section-header mb-5">
                    <h6 className="subtitle">Spotlight</h6>
                    <h2 className="title">Innovation in Motion</h2>
                </div>

                <div className="grid-layout">
                    {advertisements.map((ad, idx) => (
                        <div
                            key={ad.id || idx}
                            className={`startup-card ${idx === 0 ? 'card-large' : 'card-small'}`}
                        >
                            <img
                                src={ad.imageUrl}
                                alt={ad.name}
                                className="card-bg-img"
                            />
                            <div className="card-overlay">
                                <div className="card-tags">
                                    <Badge className="custom-badge glass-badge">FEATURED</Badge>
                                    {idx === 0 && ad.industry && (
                                        <Badge className="custom-badge glass-badge text-uppercase">{ad.industry}</Badge>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3 className="startup-name">{ad.name}</h3>
                                    <p className="startup-description">{ad.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedStartups;
