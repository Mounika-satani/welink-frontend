import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getAllStartups } from '../../service/startup';
import { useNavigate } from 'react-router-dom';
import './FeatureThisWeek.css';

const FeatureThisWeek = () => {
    const navigate = useNavigate();
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        getAllStartups(1, 8)
            .then(data => {
                if (data && Array.isArray(data.startups)) {
                    const mapped = data.startups.map(s => ({
                        id: s.id,
                        title: s.name,
                        image: s.logo_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
                    }));
                    setStartups(mapped);
                }
            })
            .catch(err => console.error('Feature Startups Fetch Error:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleNext = () => {
        if (isAnimating || startups.length <= 1) return;

        setIsAnimating(true);
        // Wait for CSS transition (0.6s) to finish before shifting array
        setTimeout(() => {
            setStartups(prev => {
                const [first, ...rest] = prev;
                return [...rest, first];
            });
            setIsAnimating(false);
        }, 600);
    };

    const handlePrev = () => {
        if (isAnimating || startups.length <= 1) return;

        setIsAnimating(true);
        // Shift array immediately but we'll need to handle the visual "jump"
        // For a simpler "same data" loop, we shift the array and reset position
        setStartups(prev => {
            const last = prev[prev.length - 1];
            const rest = prev.slice(0, -1);
            return [last, ...rest];
        });

        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    if (loading) return (
        <section className="feature-section py-5">
            <Container className="text-center">
                <Spinner animation="border" style={{ color: '#ec4899' }} />
            </Container>
        </section>
    );

    if (startups.length === 0) return null;

    const cardsToShow = window.innerWidth > 768 ? 3 : 1;
    const offset = isAnimating ? (100 / cardsToShow) : 0;

    return (
        <section className="feature-section py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                    <h2 className="section-title">Feature <span className="text-highlight">This Week</span></h2>
                </div>

                <div className="ftw-carousel-wrapper">
                    <div className="ftw-viewport">
                        <div
                            className="ftw-track"
                            style={{
                                transform: `translateX(-${offset}%)`,
                                transition: isAnimating ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                            }}
                        >
                            {startups.map((item, idx) => (
                                <div
                                    className="ftw-card"
                                    key={`${item.id}-${item.title}`} // Uses title to maintain identity during reorder
                                    onClick={() => navigate(`/startup/${item.id}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && navigate(`/startup/${item.id}`)}
                                >
                                    <div className="feature-img-container">
                                        <img src={item.image} alt="" className="feature-bg-blur" aria-hidden="true" />
                                        <img src={item.image} alt={item.title} className="feature-img-main" />
                                        <div className="feature-name-overlay">{item.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {startups.length > cardsToShow && (
                        <>
                            <button className="ftw-side-btn prev" onClick={handlePrev} aria-label="Previous">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button className="ftw-side-btn next" onClick={handleNext} aria-label="Next">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default FeatureThisWeek;
