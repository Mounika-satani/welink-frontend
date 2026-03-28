import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import ads1 from '../../assets/ads1.jpeg';
import ads2 from '../../assets/ads2.jpeg';
import ads3 from '../../assets/ads3.jpeg';
import './FeaturedStartups.css';

const FeaturedStartups = () => {
    // Static data as requested, using local image assets
    const advertisements = [
        {
            id: 'static-1',
            name: 'Innovating the Future',
            description: 'Leading the way in next-generation AI and machine learning solutions.',
            imageUrl: ads1,
            industry: 'Technology'
        },
        {
            id: 'static-2',
            name: 'Sustainable Growth',
            description: 'Green energy initiatives that power the modern world.',
            imageUrl: ads2,
            industry: 'Energy'
        },
        {
            id: 'static-3',
            name: 'Digital Evolution',
            description: 'Transforming businesses with cutting-edge software development.',
            imageUrl: ads3,
            industry: 'Software'
        }
    ];

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
                            key={ad.id}
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
                                    {ad.industry && (
                                        <Badge className="custom-badge glass-badge text-uppercase">{ad.industry}</Badge>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3 className="startup-name">{ad.name}</h3>
                                    <p className="startup-description text-truncate-2">{ad.description}</p>
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
