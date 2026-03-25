import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTrendingStartups } from '../service/startup';
import { getTrendingPosts } from '../service/post';
import PostViewModal from '../components/PostViewModal';
import { useAuth } from '../context/AuthContext';
import './Trending.css';



const Trending = () => {
    const [startups, setStartups] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dbUser, token } = useAuth();

    useEffect(() => {
        Promise.all([
            getTrendingStartups(9),
            getTrendingPosts()
        ])
            .then(([s, p]) => {
                setStartups(s);
                setPosts(p);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} className="mb-3" />
                <p className="text-muted">Loading trending startups...</p>
            </div>
        </div>
    );

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <p className="text-danger mb-3">⚠️ {error}</p>
                <button className="btn btn-outline-light btn-sm" onClick={() => window.location.reload()}>Retry</button>
            </div>
        </div>
    );

    // ── Empty state ────────────────────────────────────────────────────────────
    if (startups.length === 0) return (
        <div className="trending-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <p className="text-muted">No trending startups yet. Check back soon!</p>
            </div>
        </div>
    );

    return (
        <div className="trending-page">
            <Container>
                <div className="mb-4">
                    <Link to="/" className="text-decoration-none text-white-50 d-inline-flex align-items-center gap-2 back-home-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Home
                    </Link>
                </div>
                <div className="trending-header mb-5">
                    <h1>Trending</h1>
                    <p>Startups gaining the most momentum this week — by views, upvotes, and growth velocity.</p>
                </div>

                <Row className="g-4">
                    {startups.slice(0, 6).map((startup, index) => {
                        const metrics = startup.metrics || {};
                        const rank = index + 1;

                        // Pick the best available image
                        const heroImage = startup.logo_url
                            || startup.posts?.[0]?.media_url
                            || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;

                        return (
                            <Col lg={4} md={6} sm={12} key={startup.id}>
                                <Link to={`/startup/${startup.id}`} className="text-decoration-none">
                                    <Card className="trending-grid-card border-0 text-white">
                                        {startup.logo_url ? (
                                            <Card.Img
                                                src={heroImage}
                                                alt={startup.name}
                                                className="trending-img"
                                                onError={e => {
                                                    e.target.src = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800`;
                                                }}
                                            />
                                        ) : (
                                            <div className="trending-img d-flex align-items-center justify-content-center"
                                                style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', fontSize: '4rem', fontWeight: 700, color: '#ff3366' }}>
                                                {startup.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div className="trending-overlay">
                                            <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                <div className="rank-badge">#{rank}</div>
                                            </div>

                                            <div className="trending-content p-4 mt-auto w-100">
                                                <div className="hot-tag mb-1">Hot Right Now</div>
                                                <Card.Title className="fw-bold mb-1 fs-5 text-truncate">{startup.name}</Card.Title>
                                                <Card.Text className="small text-white-75 mb-3 text-truncate">
                                                    {startup.tagline || startup.description || '—'}
                                                </Card.Text>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-3 text-white-50 small fw-medium">
                                                    </div>

                                                    <div className="arrow-icon">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                                            <polyline points="7 7 17 7 17 17"></polyline>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>

                {posts.length > 0 && (
                    <>
                        <div className="trending-header mt-5 mb-4">
                            <h2>Trending Posts</h2>
                            <p>Individual updates and milestones that are capturing the community's attention.</p>
                        </div>

                        <Row className="g-4 mb-5">
                            {posts.slice(0, 6).map((post, index) => {
                                const metrics = post.metrics || {};
                                const rank = index + 1;
                                const heroImage = post.media_urls?.[0] || post.media_url || post.startup?.logo_url;

                                return (
                                    <Col lg={4} md={6} sm={12} key={post.id}>
                                        <div className="text-decoration-none cursor-pointer" onClick={() => {
                                            setSelectedPost(post);
                                            setShowModal(true);
                                        }}>
                                            <Card className="trending-grid-card border-0 text-white post-trending-card">
                                                {heroImage ? (
                                                    <Card.Img
                                                        src={heroImage}
                                                        alt={post.title}
                                                        className="trending-img"
                                                    />
                                                ) : (
                                                    <div className="trending-img d-flex align-items-center justify-content-center"
                                                        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)' }}>
                                                        <div className="p-3 text-center">{post.title}</div>
                                                    </div>
                                                )}

                                                <div className="trending-overlay">
                                                    <div className="d-flex justify-content-between w-100 p-3 align-items-start">
                                                        <div className="rank-badge rank-post">#{rank}</div>
                                                    </div>

                                                    <div className="trending-content p-4 mt-auto w-100">
                                                        <div className="hot-tag tag-post mb-1">{post.startup?.name}</div>
                                                        <Card.Title className="fw-bold mb-1 fs-5 line-clamp-2">{post.title || 'Update'}</Card.Title>
                                                        <Card.Text className="small text-white-75 mb-3 line-clamp-2">
                                                            {(post.content || '').substring(0, 100)}...
                                                        </Card.Text>

                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex gap-3 text-white-50 small fw-medium">
                                                                <span className="d-flex align-items-center gap-1">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                                    {metrics.total_views || 0}
                                                                </span>
                                                                <span className="d-flex align-items-center gap-1">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                                                                    {metrics.total_upvotes || 0}
                                                                </span>
                                                            </div>
                                                            <div className="arrow-icon">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                                                    <polyline points="7 7 17 7 17 17"></polyline>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </>
                )}
            </Container>

            <PostViewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                post={selectedPost}
                currentUser={dbUser}
                token={token}
            />
        </div>
    );
};

export default Trending;
