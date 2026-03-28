import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTrendingPosts } from '../../service/post';
import PostViewModal from '../PostViewModal';
import { useAuth } from '../../context/AuthContext';
import './TrendingThisWeek.css';

const TrendingThisWeek = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [originalPosts, setOriginalPosts] = useState([]); // Keep original for ranks
    const { dbUser, token } = useAuth();

    useEffect(() => {
        getTrendingPosts()
            .then(data => {
                setPosts(data);
                setOriginalPosts(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const cardsToShow = window.innerWidth > 1200 ? 4 : (window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1));

    const handleNext = () => {
        if (isAnimating || posts.length <= cardsToShow) return;

        setIsAnimating(true);
        setTimeout(() => {
            setPosts(prev => {
                const [first, ...rest] = prev;
                return [...rest, first];
            });
            setIsAnimating(false);
        }, 600);
    };

    const handlePrev = () => {
        if (isAnimating || posts.length <= cardsToShow) return;

        setIsAnimating(true);
        setPosts(prev => {
            const last = prev[prev.length - 1];
            const rest = prev.slice(0, -1);
            return [last, ...rest];
        });

        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    if (loading) return (
        <section className="trending-section py-5">
            <Container className="px-5 text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} />
                <p className="text-muted mt-3">Loading trending...</p>
            </Container>
        </section>
    );

    if (error || posts.length === 0) return null;

    const offset = isAnimating ? (100 / cardsToShow) : 0;

    return (
        <section className="trending-section py-5">
            <Container className="px-4">
                <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                    <div>
                        <h6 className="text-primary text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Hot Right Now</h6>
                        <h2 className="section-title mb-0">Trending This Week</h2>
                    </div>
                    <Link to="/trending" className="view-all-link text-decoration-none text-white d-flex align-items-center">
                        See all trending
                        <span className="ms-2">↗</span>
                    </Link>
                </div>

                <div className="ftw-carousel-wrapper">
                    <div className="trending-viewport trending-scrollable">
                        <div
                            className="trending-track"
                            style={{
                                transform: `translateX(-${offset}%)`,
                                transition: isAnimating ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                            }}
                        >
                            {posts.map((post, idx) => {
                                // Find correct rank from original sorted array
                                const rank = originalPosts.findIndex(p => p.id === post.id) + 1;

                                const heroImage = post.media_urls?.[0]
                                    || post.media_url
                                    || post.startup?.logo_url
                                    || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;

                                return (
                                    <div key={`${post.id}-${post.title}`} className="trending-card-wrapper" onClick={() => {
                                        setSelectedPost(post);
                                        setShowModal(true);
                                    }}>
                                        <Card className="trending-card border-0 text-white">
                                            <Card.Img
                                                src={heroImage}
                                                alt={post.title}
                                                className="trending-img"
                                                onError={e => {
                                                    e.target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;
                                                }}
                                            />
                                            <div className="trending-overlay">
                                                <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                    <div className="rank-badge">#{rank}</div>
                                                </div>

                                                <div className="trending-content p-3 mt-auto w-100">
                                                    <div className="hot-tag mb-1">{post.startup?.name}</div>
                                                    <Card.Title className="fw-bold mb-1 fs-6 text-truncate">{post.title || 'Update'}</Card.Title>
                                                    <Card.Text className="small text-white-50 text-truncate">
                                                        {post.content || '—'}
                                                    </Card.Text>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {posts.length > cardsToShow && (
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

                <PostViewModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    post={selectedPost}
                    currentUser={dbUser}
                    token={token}
                />
            </Container>
        </section>
    );
};

export default TrendingThisWeek;

