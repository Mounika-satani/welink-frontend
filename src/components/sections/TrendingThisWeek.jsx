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
    const { dbUser, token } = useAuth();
    const trackRef = useRef(null);
    const animFrameRef = useRef(null);
    const posRef = useRef(0);

    useEffect(() => {
        getTrendingPosts()
            .then(setPosts)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const shouldScroll = posts.length > 4;

    // Auto-scroll via RAF
    useEffect(() => {
        if (!shouldScroll || !trackRef.current) return;
        const track = trackRef.current;
        const SPEED = 1.5;

        const step = () => {
            posRef.current += SPEED;
            const halfWidth = track.scrollWidth / 2;
            if (posRef.current >= halfWidth) posRef.current = 0;
            track.style.transform = `translateX(-${posRef.current}px)`;
            animFrameRef.current = requestAnimationFrame(step);
        };

        animFrameRef.current = requestAnimationFrame(step);

        const pause = () => cancelAnimationFrame(animFrameRef.current);
        const resume = () => {
            if (shouldScroll) animFrameRef.current = requestAnimationFrame(step);
        };
        track.parentElement.addEventListener('mouseenter', pause);
        track.parentElement.addEventListener('mouseleave', resume);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            track.parentElement?.removeEventListener('mouseenter', pause);
            track.parentElement?.removeEventListener('mouseleave', resume);
        };
    }, [shouldScroll, posts]);

    if (loading) return (
        <section className="trending-section py-5">
            <Container className="px-5 text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} />
                <p className="text-muted mt-3">Loading trending...</p>
            </Container>
        </section>
    );

    if (error || posts.length === 0) return null;

    const displayPosts = shouldScroll ? [...posts, ...posts] : posts;

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

                <div className={`trending-viewport ${shouldScroll ? 'trending-scrollable' : 'trending-static'}`}>
                    <div className="trending-track" ref={shouldScroll ? trackRef : null}>
                        {displayPosts.map((post, idx) => {
                            const actualIndex = posts.findIndex(p => p.id === post.id);
                            const rank = actualIndex + 1;

                            const heroImage = post.media_urls?.[0]
                                || post.media_url
                                || post.startup?.logo_url
                                || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;

                            return (
                                <div key={`${post.id}-${idx}`} className="trending-card-wrapper" onClick={() => {
                                    setSelectedPost(post);
                                    setShowModal(true);
                                }}>
                                    <div className="text-decoration-none cursor-pointer">
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
                                </div>
                            );
                        })}
                    </div>
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

