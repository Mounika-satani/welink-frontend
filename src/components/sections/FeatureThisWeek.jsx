import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getAllStartups } from '../../service/startup';
import { useNavigate } from 'react-router-dom';
import './FeatureThisWeek.css';

const FeatureThisWeek = () => {
    const navigate = useNavigate();
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const trackRef = useRef(null);
    const animFrameRef = useRef(null);
    const posRef = useRef(0);

    useEffect(() => {
        // Fetch newly added startups (limit 6)
        getAllStartups(1, 6)
            .then(data => {
                if (data && Array.isArray(data.startups)) {
                    // Startups are typically sorted by creation date or trending score
                    // We just take the top 6 from the first page
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

    const shouldScroll = startups.length > 3;

    // Auto-scroll via RAF
    useEffect(() => {
        if (!shouldScroll || !trackRef.current) return;
        const track = trackRef.current;
        const SPEED = 1.0;

        const step = () => {
            posRef.current += SPEED;
            const halfWidth = track.scrollWidth / 2;
            if (posRef.current >= halfWidth) posRef.current = 0;
            track.style.transform = `translateX(-${posRef.current}px)`;
            animFrameRef.current = requestAnimationFrame(step);
        };

        animFrameRef.current = requestAnimationFrame(step);
        const pause = () => cancelAnimationFrame(animFrameRef.current);
        const resume = () => { animFrameRef.current = requestAnimationFrame(step); };

        const container = track.parentElement;
        container.addEventListener('mouseenter', pause);
        container.addEventListener('mouseleave', resume);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            if (container) {
                container.removeEventListener('mouseenter', pause);
                container.removeEventListener('mouseleave', resume);
            }
        };
    }, [shouldScroll, startups]);

    if (loading) return (
        <section className="feature-section py-5">
            <Container className="text-center">
                <Spinner animation="border" style={{ color: '#ec4899' }} />
            </Container>
        </section>
    );

    if (startups.length === 0) return null;

    // Duplicate list for infinite scroll if we should scroll
    const displayStartups = shouldScroll ? [...startups, ...startups] : startups;

    return (
        <section className="feature-section py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4 px-4">
                    <h2 className="section-title">Feature <span className="text-highlight">This Week</span></h2>
                </div>

                <div className={`ftw-viewport ${shouldScroll ? 'ftw-scrollable' : 'ftw-static'}`}>
                    <div className="ftw-track" ref={shouldScroll ? trackRef : null}>
                        {displayStartups.map((item, idx) => (
                            <div
                                className="ftw-card"
                                key={`${item.id}-${idx}`}
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
            </Container>
        </section>
    );
};

export default FeatureThisWeek;
