import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import spotlight1 from '../../assets/spotlight1.png';
import spotlight2 from '../../assets/spotlight2.png';
import spotlight3 from '../../assets/spotlight3.png';
import './FeaturedStartups.css';

const FeaturedStartups = () => {
    const navigate = useNavigate();

    // Premium Spotlight content using high-quality assets
    const advertisements = [
        {
            id: 'static-1',
            name: 'Innovating the Future',
            description: 'Experience next-generation AI and machine learning solutions that redefine industrial productivity.',
            imageUrl: spotlight1,
            industry: 'Technology',
            accent: '#0ea5e9' // Sky blue accent
        },
        {
            id: 'static-2',
            name: 'Sustainable Growth',
            description: 'Powering the modern world with breakthrough green energy and eco-conscious engineering.',
            imageUrl: spotlight2,
            industry: 'Energy',
            accent: '#10b981' // Emerald accent
        },
        {
            id: 'static-3',
            name: 'Digital Evolution',
            description: 'Transforming businesses into digital powerhouses with high-performance software architecture.',
            imageUrl: spotlight3,
            industry: 'Software',
            accent: '#8b5cf6' // Violet accent
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
                            style={{ '--accent-color': ad.accent }}
                            onClick={() => navigate('/discover')}
                            role="button"
                            tabIndex={0}
                        >
                            <img
                                src={ad.imageUrl}
                                alt={ad.name}
                                className="card-bg-img"
                            />
                            <div className="card-overlay">
                                <div className="card-content">
                                    <h3 className="startup-name">{ad.name}</h3>
                                    <p className="startup-description">{ad.description}</p>
                                    <div className="card-action">
                                        <span>Discover More</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                                    </div>
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
