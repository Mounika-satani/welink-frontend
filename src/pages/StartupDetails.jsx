import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../service/api';
import CommentsSection from '../components/sections/CommentsSection';
import './StartupDetails.css';

const BackArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
);
const MapPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 0-18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const Users = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const Briefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);

const StartupDetails = () => {
    const { id } = useParams();
    const { token, dbUser } = useAuth();

    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const commentsRef = useRef(null);

    const fetchStartup = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/startups/details/${id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error('Startup not found');
            const data = await res.json();
            setStartup(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartup();
    }, [id, token]);

    const handleVote = async (post_id, vote_type) => {
        if (!token) return alert('Please login to vote');
        try {
            const res = await fetch(`${API_URL}/post-votes/cast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: dbUser?.id,
                    post_id,
                    vote_type
                })
            });
            if (!res.ok) return;
            const data = await res.json();

            setSelectedPost(prev => ({
                ...prev,
                total_upvotes: data.upvotes,
                total_downvotes: data.downvotes,
                userVote: data.userVote
            }));

            setStartup(prev => ({
                ...prev,
                posts: prev.posts.map(p => p.id === post_id ? {
                    ...p,
                    total_upvotes: data.upvotes,
                    total_downvotes: data.downvotes
                } : p)
            }));
        } catch (err) {
            console.error('Vote error:', err);
        }
    };

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const nextMedia = (e) => {
        e.stopPropagation();
        if (selectedPost?.media_urls && currentMediaIndex < selectedPost.media_urls.length - 1) {
            setCurrentMediaIndex(prev => prev + 1);
        }
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(prev => prev - 1);
        }
    };

    // Reset index when modal opens/changes
    useEffect(() => {
        setCurrentMediaIndex(0);
    }, [selectedPost]);

    const StackIcon = () => (
        <div className="ig-multi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}>
                <rect x="7" y="7" width="14" height="14" rx="2" ry="2" />
                <path d="M17 3H5a2 2 0 0 0-2 2v12" />
            </svg>
        </div>
    );

    if (loading) return (
        <div className="startup-details-page d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="text-center">
                <Spinner animation="border" style={{ color: '#ff3366' }} className="mb-3" />
                <p className="text-muted">Loading startup...</p>
            </div>
        </div>
    );

    if (error || !startup) return (
        <div className="startup-details-page d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="text-center">
                <h4 className="text-white mb-3">Startup Not Found</h4>
                <p className="text-muted mb-4">{error || 'This startup does not exist.'}</p>
                <Link to="/discover" className="btn btn-outline-light">Back to Discover</Link>
            </div>
        </div>
    );

    const founders = startup.founders || [];
    const metrics = startup.metrics || {};

    const StatusBadge = ({ status }) => {
        const colors = {
            DRAFT: '#f59e0b',
            PENDING: '#f59e0b',
            APPROVED: '#10b981',
            REJECTED: '#ef4444',
        };
        return (
            <span style={{
                background: `${colors[status] || '#64748b'}22`,
                color: colors[status] || '#64748b',
                border: `1px solid ${colors[status] || '#64748b'}55`,
                padding: '3px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="startup-details-page">
            <div className="banner-bg">
                <Button variant="dark" className="btn-back" as={Link} to="/discover">
                    <BackArrow /> Back to Discover
                </Button>
            </div>

            <Container className="content-container">
                <div className="profile-card d-flex flex-column flex-md-row align-items-center gap-4 p-4 mb-5 shadow-lg" style={{ background: '#0d0e15', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="d-flex flex-column align-items-center gap-3 flex-shrink-0">
                        <div className="startup-logo-large shadow-sm" style={{ width: 80, height: 80, background: '#fff', borderRadius: 16 }}>
                            {startup.logo_url
                                ? <img src={startup.logo_url} alt={startup.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16, padding: '8px' }} />
                                : <span style={{ color: '#000', fontSize: '2rem' }}>{startup.name?.charAt(0).toUpperCase()}</span>
                            }
                        </div>
                        <div className="d-flex flex-column align-items-center gap-2">
                            {startup.industry && (
                                <span className="details-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {startup.industry.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow-1 text-center">
                        <h1 className="details-title mb-1 text-white" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
                            {startup.name}
                        </h1>
                        <p className="details-tagline mb-4 text-secondary" style={{ fontSize: '1.1rem', opacity: 0.7 }}>
                            {startup.tagline}
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-4 text-secondary small mb-3" style={{ opacity: 0.8 }}>
                            {startup.location && (
                                <span className="d-flex align-items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4785" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    {startup.location}
                                </span>
                            )}
                            {startup.team_size && (
                                <span className="d-flex align-items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    {startup.team_size} employees
                                </span>
                            )}
                            {startup.funding_stage && (
                                <span className="d-flex align-items-center gap-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                                    {startup.funding_stage}
                                </span>
                            )}
                            {startup.founded_year && (
                                <span className="d-flex align-items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    Founded {startup.founded_year}
                                </span>
                            )}
                        </div>


                    </div>

                    <div className="action-buttons d-flex align-items-start gap-2 flex-shrink-0 align-self-start">
                        {startup.website_url && (
                            <a
                                href={startup.website_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary text-decoration-none small d-flex align-items-center px-2"
                                style={{ height: 42 }}
                            >
                                Visit Website
                            </a>
                        )}
                    </div>
                </div>

                <Row className="g-4">
                    <Col lg={8}>
                        <div className="info-section mb-4">
                            <h3 className="section-head mb-4 text-white">About</h3>
                            {startup.description
                                ? <p className="text-secondary" style={{ lineHeight: 1.85 }}>{startup.description}</p>
                                : <p className="text-muted fst-italic">No description provided yet.</p>
                            }
                        </div>

                        {startup.posts && startup.posts.length > 0 && (
                            <div className="info-section mb-4">
                                <h3 className="section-head mb-4 text-white">Product Showcases & Updates</h3>
                                <div className="instagram-grid">
                                    {startup.posts.map((post, idx) => (
                                        <div key={idx} className="ig-item" onClick={() => setSelectedPost(post)}>
                                            <div className="ig-square">
                                                {post.media_url ? (
                                                    post.media_type === 'VIDEO' ? (
                                                        <video src={post.media_url} draggable="false" />
                                                    ) : (
                                                        <img src={post.media_url} alt={post.title} draggable="false" />
                                                    )
                                                ) : (
                                                    <div className="ig-placeholder">{post.title.charAt(0)}</div>
                                                )}
                                                {post.media_urls?.length > 1 && <StackIcon />}
                                                <div className="ig-overlay">
                                                    <div className="d-flex gap-3 align-items-center">
                                                        <div className="d-flex align-items-center gap-1">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>
                                                            {post.total_upvotes || 0}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                            {post.comments_count || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                                {post.media_type === 'VIDEO' && post.media_urls?.length <= 1 && (
                                                    <div className="ig-video-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Col>

                    <Col lg={4}>
                        <div className="info-section sidebar-card mb-4">
                            <h3 className="section-head mb-4 text-white">Founders</h3>
                            {founders.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {founders.map((founder, idx) => (
                                        <div key={idx} className="founder-card d-flex gap-3 align-items-center">
                                            <div style={{
                                                width: 44, height: 44, borderRadius: '50%',
                                                background: '#ff3366',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden'
                                            }}>
                                                {founder.photo_url
                                                    ? <img src={founder.photo_url} alt={founder.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : founder.name?.charAt(0)
                                                }
                                            </div>
                                            <div>
                                                <div className="founder-name">{founder.name}</div>
                                                <div className="founder-role">{founder.role}</div>
                                                {founder.linkedin_url && (
                                                    <a href={founder.linkedin_url} target="_blank" rel="noreferrer" className="text-info small">LinkedIn ↗</a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className=" small fst-italic">No founders listed.</p>
                            )}
                        </div>


                    </Col>
                </Row>
            </Container>

            <Modal
                show={!!selectedPost}
                onHide={() => setSelectedPost(null)}
                size="xl"
                centered
                contentClassName="ig-modal-content"
                className="ig-details-modal"
            >
                <Modal.Body className="p-0">
                    {selectedPost && (
                        <Row className="g-0" style={{ minHeight: '80vh' }}>
                            <Col lg={7} className="bg-black d-flex align-items-center justify-content-center position-relative">
                                {selectedPost.media_urls?.length > 1 ? (
                                    <>
                                        <button className="carousel-arrow left" onClick={prevMedia} disabled={currentMediaIndex === 0}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                        </button>
                                        <button className="carousel-arrow right" onClick={nextMedia} disabled={currentMediaIndex === selectedPost.media_urls.length - 1}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                        </button>
                                        <div className="carousel-indicators">
                                            {selectedPost.media_urls.map((_, i) => (
                                                <div key={i} className={`indicator-dot ${i === currentMediaIndex ? 'active' : ''}`} />
                                            ))}
                                        </div>

                                        {selectedPost.media_urls[currentMediaIndex].includes('.mp4') || selectedPost.media_urls[currentMediaIndex].includes('.mov') ? (
                                            <video src={selectedPost.media_urls[currentMediaIndex]} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                                        ) : (
                                            <img src={selectedPost.media_urls[currentMediaIndex]} alt={selectedPost.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                                        )}
                                    </>
                                ) : (
                                    selectedPost.media_url ? (
                                        selectedPost.media_type === 'VIDEO' ? (
                                            <video src={selectedPost.media_url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                                        ) : (
                                            <img src={selectedPost.media_url} alt={selectedPost.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                                        )
                                    ) : (
                                        <div className="h-100 w-100 d-flex align-items-center justify-content-center text-secondary">No Media</div>
                                    )
                                )}
                            </Col>
                            <Col lg={5} className="d-flex flex-column" style={{ maxHeight: '80vh' }}>
                                <div className="p-3 border-bottom border-dark d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2 text-white">
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                            {startup.name?.charAt(0)}
                                        </div>
                                        <span className="fw-bold">{startup.name}</span>
                                    </div>
                                    <button className="btn btn-link text-white p-0" onClick={() => setSelectedPost(null)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                                <div className="p-3 flex-grow-1 overflow-auto ig-custom-scroll">
                                    <div className="mb-4">
                                        <h5 className="mb-1 text-white">{selectedPost.title}</h5>
                                        <p className="text-secondary small mb-3">{selectedPost.content}</p>
                                        <div className="d-flex gap-2">
                                            {selectedPost.demo_link && (
                                                <a href={selectedPost.demo_link} target="_blank" rel="noreferrer" className="btn btn-sm btn-info text-white flex-grow-1">Live Demo ↗</a>
                                            )}
                                            {selectedPost.external_link && (
                                                <a href={selectedPost.external_link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary flex-grow-1">Article ↗</a>
                                            )}
                                        </div>
                                    </div>

                                    {selectedPost.status === 'APPROVED' && (
                                        <div className="mt-4 pt-4 border-top border-dark" ref={commentsRef}>
                                            {selectedPost.comments_enabled !== false ? (
                                                <CommentsSection
                                                    postId={selectedPost.id}
                                                    dbUser={dbUser || {}}
                                                    token={token}
                                                    startupOwnerId={startup.owner_user_id}
                                                />
                                            ) : (
                                                <div style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                    gap: 8, padding: '1.5rem', textAlign: 'center',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)'
                                                }}>
                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        <line x1="2" y1="2" x2="22" y2="22" />
                                                    </svg>
                                                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                                                        Comments are turned off for this post
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-top border-dark mt-auto bg-black">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex gap-3 align-items-center">
                                            <div
                                                className="d-flex align-items-center gap-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleVote(selectedPost.id, 1)}
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedPost.userVote === 1 ? "#198754" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                                <span className="small fw-bold text-success">{selectedPost.total_upvotes || 0}</span>
                                            </div>
                                            <div
                                                className="d-flex align-items-center gap-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleVote(selectedPost.id, -1)}
                                            >
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedPost.userVote === -1 ? "#dc3545" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                                                <span className="small fw-bold text-danger">{selectedPost.total_downvotes || 0}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="text-secondary" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {new Date(selectedPost.createdAt || selectedPost.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default StartupDetails;
