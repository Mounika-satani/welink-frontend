import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyStartup, deleteStartup } from '../service/startup';
import { API_URL } from '../service/api';
import { updatePost, deletePost } from '../service/post';
import CommentsSection from '../components/sections/CommentsSection';
import './StartupDetails.css';

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
            fontSize: '0.8rem',
            fontWeight: 600
        }}>
            {status}
        </span>
    );
};

const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
);
const TwitterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
);
const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
);
const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
);

const MyStartupDetails = () => {
    const { token, dbUser } = useAuth();
    const navigate = useNavigate();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    const [editPost, setEditPost] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editExistingUrls, setEditExistingUrls] = useState([]);
    const [editNewFiles, setEditNewFiles] = useState([]);
    const [editNewPreviews, setEditNewPreviews] = useState([]);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(false);
    const editFileRef = useRef();

    const [deletePostTarget, setDeletePostTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // ── Delete Startup ───────────────────────────────────────────────
    const [deleteStartupOpen, setDeleteStartupOpen] = useState(false);
    const [deleteStartupLoading, setDeleteStartupLoading] = useState(false);
    const [deleteStartupError, setDeleteStartupError] = useState(null);

    const fetchStartup = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await getMyStartup(token);
            setStartup(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartup();
    }, [token]);

    const handleDeleteStartup = async () => {
        if (!startup?.id || deleteStartupLoading) return;
        setDeleteStartupLoading(true);
        setDeleteStartupError(null);
        try {
            await deleteStartup(token, startup.id);
            navigate('/');
        } catch (err) {
            setDeleteStartupError(err.message || 'Failed to delete startup.');
            setDeleteStartupLoading(false);
        }
    };

    // ── Edit helpers ─────────────────────────────────────────────────
    const openEditModal = (e, post) => {
        e.stopPropagation(); // don't open view modal
        setEditPost(post);
        setEditForm({
            title: post.title || '',
            content: post.content || '',
            post_type: post.post_type || 'UPDATE',
            media_type: post.media_type || 'IMAGE',
            demo_link: post.demo_link || '',
            external_link: post.external_link || '',
            comments_enabled: post.comments_enabled !== false,
        });
        const existing = post.media_urls && post.media_urls.length > 0
            ? post.media_urls
            : (post.media_url ? [post.media_url] : []);
        setEditExistingUrls(existing);
        setEditNewFiles([]);
        setEditNewPreviews([]);
        setEditError(null);
        setEditSuccess(false);
    };

    const closeEditModal = () => {
        setEditPost(null);
        setEditNewFiles([]);
        setEditNewPreviews([]);
    };

    const handleEditFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditMediaChange = (e) => {
        const selected = Array.from(e.target.files);
        if (!selected.length) return;
        const combined = [...editNewFiles, ...selected].slice(0, 10 - editExistingUrls.length);
        setEditNewFiles(combined);
        Promise.all(combined.map(f => new Promise(res => {
            const reader = new FileReader();
            reader.onloadend = () => res({ url: reader.result, type: f.type });
            reader.readAsDataURL(f);
        }))).then(setEditNewPreviews);
    };

    const removeEditExisting = (idx) => {
        setEditExistingUrls(prev => prev.filter((_, i) => i !== idx));
    };

    const removeEditNew = (idx) => {
        const newFiles = editNewFiles.filter((_, i) => i !== idx);
        setEditNewFiles(newFiles);
        setEditNewPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editPost) return;
        setEditLoading(true);
        setEditError(null);
        try {
            const data = new FormData();
            Object.entries(editForm).forEach(([key, val]) => {
                data.append(key, val);
            });
            data.append('keep_media', JSON.stringify(editExistingUrls));
            editNewFiles.forEach(f => data.append('media', f));
            data.append('comments_enabled', editForm.comments_enabled ? 'true' : 'false');

            await updatePost(token, editPost.id, data);
            setEditSuccess(true);
            await fetchStartup();
            setTimeout(() => closeEditModal(), 1200);
        } catch (err) {
            setEditError(err.message);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeletePost = async () => {
        if (!deletePostTarget) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await deletePost(token, deletePostTarget.id);
            setStartup(prev => ({
                ...prev,
                posts: prev.posts.filter(p => p.id !== deletePostTarget.id)
            }));
            setDeletePostTarget(null);
        } catch (err) {
            setDeleteError(err.message || 'Failed to delete post.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVote = async (post_id, vote_type) => {
        if (!dbUser) return alert('Please login to vote');
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
                userVote: data.userVote
            }));

            setStartup(prev => ({
                ...prev,
                posts: prev.posts.map(p => p.id === post_id ? {
                    ...p,
                    total_upvotes: data.upvotes,
                } : p)
            }));
        } catch (err) {
            console.error('Vote error:', err);
        }
    };

    const [togglingComments, setTogglingComments] = useState(false);

    const handleToggleComments = async () => {
        if (!selectedPost || togglingComments) return;
        const newValue = selectedPost.comments_enabled === false ? true : false;
        setTogglingComments(true);
        try {
            const res = await fetch(`${API_URL}/posts/${selectedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ comments_enabled: newValue })
            });
            if (!res.ok) throw new Error('Failed to update');
            setSelectedPost(prev => ({ ...prev, comments_enabled: newValue }));
            setStartup(prev => ({
                ...prev,
                posts: prev.posts.map(p => p.id === selectedPost.id
                    ? { ...p, comments_enabled: newValue }
                    : p
                )
            }));
        } catch (err) {
            console.error('Toggle comments error:', err);
        } finally {
            setTogglingComments(false);
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
        <div className="startup-details-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <div className="spinner-border text-info mb-3" role="status" />
                <p className="text-muted">Loading your startup...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="startup-details-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <h4 className="text-white mb-3">No Startup Found</h4>
                <p className="text-muted mb-4">{error}</p>
                <Link to="/submit-startup" className="btn btn-info text-white">Submit Your Startup</Link>
            </div>
        </div>
    );

    const founders = startup?.founders || [];

    return (
        <>
            <div className="startup-details-page">
                <div
                    className="banner-bg"
                    style={startup?.banner_url ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(13,14,21,1)), url(${startup.banner_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    } : undefined}
                >
                    <Link to="/profile" className="btn btn-dark btn-back d-inline-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </Link>
                </div>

                <Container className="content-container">
                    <div className="profile-card d-flex flex-column flex-md-row align-items-center gap-4 p-4 mb-5 shadow-lg" style={{ background: '#0d0e15', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="d-flex flex-column align-items-center gap-3 flex-shrink-0">
                            <div className="startup-logo-large shadow-sm" style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
                                {startup.logo_url
                                    ? <img src={startup.logo_url} alt={startup.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                                    : <span style={{ color: '#fff', fontSize: '2rem' }}>{startup.name?.charAt(0).toUpperCase()}</span>
                                }
                            </div>
                            <div className="d-flex flex-column align-items-center gap-2">
                                <StatusBadge status={startup.status} />
                                <div className="d-flex flex-row flex-wrap justify-content-center gap-2">
                                    {startup.industries && startup.industries.length > 0 ? (
                                        startup.industries.map((ind, idx) => (
                                            <span key={idx} className="details-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                {ind.name}
                                            </span>
                                        ))
                                    ) : (
                                        startup.industry && (
                                            <span className="details-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                {startup.industry.name}
                                            </span>
                                        )
                                    )}
                                </div>
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
                                    <span className="d-flex align-items-center gap-2">
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
                            <Link
                                to="/submit-startup"
                                state={{ editMode: true }}
                                className="btn btn-info btn-sm text-white d-flex align-items-center shadow-sm"
                                style={{ height: 42, borderRadius: 10, padding: '0 20px', fontWeight: 600 }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                Edit Startup
                            </Link>

                            {/* Delete Startup button */}
                            <button
                                onClick={() => { setDeleteStartupError(null); setDeleteStartupOpen(true); }}
                                title="Delete this startup"
                                className="btn btn-sm d-flex align-items-center justify-content-center"
                                style={{
                                    height: 42, width: 42, borderRadius: 10, flexShrink: 0,
                                    background: 'rgba(239,68,68,0.10)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    color: '#f87171',
                                    transition: 'background 0.18s, border-color 0.18s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    <path d="M10 11v6" /><path d="M14 11v6" />
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <Row className="g-4">
                        <Col lg={8}>
                            <div className="info-section mb-4">
                                <h3 className="section-head mb-4">About</h3>
                                {startup.description
                                    ? <p className="text-secondary" style={{ lineHeight: 1.8 }}>{startup.description}</p>
                                    : <p className="text-muted fst-italic">No description provided yet.</p>
                                }
                            </div>

                            {startup.metrics && (
                                <div className="info-section mb-4">
                                    <h3 className="section-head mb-4">Metrics</h3>
                                    <Row className="g-3">
                                        {[
                                            { label: 'Upvotes', value: startup.metrics.total_upvotes ?? 0, color: '#10b981' },

                                            { label: 'Views', value: startup.metrics.total_views ?? 0, color: '#0ea5e9' },
                                            { label: 'Trending Score', value: Number(startup.metrics.trending_score ?? 0).toFixed(3), color: '#f59e0b' },
                                        ].map(({ label, value, color }) => (
                                            <Col xs={6} md={3} key={label}>
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    borderRadius: 12,
                                                    padding: '1rem',
                                                    textAlign: 'center'

                                                }}>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: color }}>{value}</div>
                                                    <div className="small mt-1">{label}</div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            <div className="info-section mb-4">
                                <h3 className="section-head mb-4">Product Showcases & Updates</h3>
                                {startup.posts && startup.posts.length > 0 ? (
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

                                                    {post.status === 'PENDING' && (
                                                        <div className="ig-pending-badge">
                                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                                            </svg>
                                                            Pending
                                                        </div>
                                                    )}

                                                    <div className="ig-overlay">
                                                        <div className="d-flex gap-3 align-items-center">
                                                            <span className="d-flex align-items-center gap-1">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>
                                                                {post.total_upvotes || 0}
                                                            </span>
                                                            <span className="d-flex align-items-center gap-1">
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                                {post.comments_count || 0}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {post.media_type === 'VIDEO' && post.media_urls?.length <= 1 && (
                                                        <div className="ig-video-icon">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                                        </div>
                                                    )}

                                                    <div className="ig-action-row">
                                                        <button
                                                            className="ig-action-btn"
                                                            title="Edit post"
                                                            onClick={(e) => openEditModal(e, post)}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="ig-action-btn ig-action-delete"
                                                            title="Delete post"
                                                            onClick={(e) => { e.stopPropagation(); setDeletePostTarget(post); setDeleteError(null); }}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6" />
                                                                <path d="M14 11v6" />
                                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5" style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                                        <p className="text-muted mb-0">No showcases uploaded yet.</p>
                                        <p className="small text-muted">Use the "Upload Media" button in the navbar to showcase your product!</p>
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div className="info-section sidebar-card mb-4">
                                <h3 className="section-head mb-4">Founders</h3>
                                {founders.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {founders.map((founder, idx) => (
                                            <div key={idx} className="founder-card d-flex gap-3 align-items-center">
                                                <div style={{
                                                    width: 44, height: 44, borderRadius: '50%',
                                                    background: '#0ea5e9',
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
                                    <p className="text-muted small fst-italic">No founders added yet.</p>
                                )}
                            </div>

                            {(startup.website_url || startup.founded_year || startup.incorporation_certificate_url) && (
                                <div className="info-section sidebar-card mb-4">
                                    <h3 className="section-head mb-4">Company Details</h3>
                                    <div className="d-flex flex-column gap-3">
                                        {(startup.website_url || startup.linkedin_url || startup.twitter_url || startup.instagram_url || startup.facebook_url) && (
                                            <div className="d-flex flex-column gap-2">
                                                <span className="small text-muted mb-1">Company Links</span>
                                                {startup.website_url && (
                                                    <a href={startup.website_url} target="_blank" rel="noreferrer"
                                                        className="link-item d-flex justify-content-between align-items-center text-decoration-none p-2 mb-1"
                                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                                            <span>Website</span>
                                                        </div>
                                                        <span className="small">↗</span>
                                                    </a>
                                                )}
                                                {startup.linkedin_url && (
                                                    <a href={startup.linkedin_url} target="_blank" rel="noreferrer"
                                                        className="link-item d-flex justify-content-between align-items-center text-decoration-none p-2 mb-1"
                                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <LinkedInIcon />
                                                            <span>LinkedIn</span>
                                                        </div>
                                                        <span className="small">↗</span>
                                                    </a>
                                                )}
                                                {startup.twitter_url && (
                                                    <a href={startup.twitter_url} target="_blank" rel="noreferrer"
                                                        className="link-item d-flex justify-content-between align-items-center text-decoration-none p-2 mb-1"
                                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <TwitterIcon />
                                                            <span>Twitter</span>
                                                        </div>
                                                        <span className="small">↗</span>
                                                    </a>
                                                )}
                                                {startup.instagram_url && (
                                                    <a href={startup.instagram_url} target="_blank" rel="noreferrer"
                                                        className="link-item d-flex justify-content-between align-items-center text-decoration-none p-2 mb-1"
                                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <InstagramIcon />
                                                            <span>Instagram</span>
                                                        </div>
                                                        <span className="small">↗</span>
                                                    </a>
                                                )}
                                                {startup.facebook_url && (
                                                    <a href={startup.facebook_url} target="_blank" rel="noreferrer"
                                                        className="link-item d-flex justify-content-between align-items-center text-decoration-none p-2 mb-1"
                                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FacebookIcon />
                                                            <span>Facebook</span>
                                                        </div>
                                                        <span className="small">↗</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        {startup.founded_year && (
                                            <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span className="small">Founded Year</span>
                                                <span className="text-white fw-semibold">{startup.founded_year}</span>
                                            </div>
                                        )}
                                        {startup.incorporation_certificate_url && (
                                            <div className="d-flex flex-column gap-1 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span className="small">Incorporation Certificate</span>
                                                <a
                                                    href={startup.incorporation_certificate_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="d-inline-flex align-items-center gap-2 text-decoration-none"
                                                    style={{
                                                        background: 'rgba(14,165,233,0.1)',
                                                        border: '1px solid rgba(14,165,233,0.3)',
                                                        borderRadius: 8,
                                                        padding: '8px 12px',
                                                        color: '#0ea5e9',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                        <line x1="16" y1="13" x2="8" y2="13" />
                                                        <line x1="16" y1="17" x2="8" y2="17" />
                                                    </svg>
                                                    View / Download Certificate
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}


                        </Col>
                    </Row>
                </Container>

                {/* Post Detail Modal */}
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
                                <Col lg={7} className="bg-black d-flex align-items-center justify-content-center">
                                    {selectedPost.media_urls?.length > 1 ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                                        </div>
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
                                        <div className="d-flex align-items-center gap-2">
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
                                            <h5 className="mb-1">{selectedPost.title}</h5>
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
                                            <div className="mt-4 pt-4 border-top border-dark">
                                                {selectedPost.comments_enabled !== false ? (
                                                    <CommentsSection
                                                        postId={selectedPost.id}
                                                        dbUser={dbUser}
                                                        token={token}
                                                        startupOwnerId={dbUser?.id}
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

                                            </div>

                                            {/* ── Owner comments toggle ── */}
                                            <button
                                                onClick={handleToggleComments}
                                                disabled={togglingComments}
                                                title={selectedPost.comments_enabled !== false ? 'Turn off comments' : 'Turn on comments'}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 6,
                                                    background: selectedPost.comments_enabled !== false
                                                        ? 'rgba(255,51,102,0.12)'
                                                        : 'rgba(255,255,255,0.06)',
                                                    border: `1px solid ${selectedPost.comments_enabled !== false ? 'rgba(255,51,102,0.4)' : 'rgba(255,255,255,0.12)'}`,
                                                    borderRadius: 20, padding: '4px 12px',
                                                    cursor: togglingComments ? 'not-allowed' : 'pointer',
                                                    opacity: togglingComments ? 0.5 : 1,
                                                    transition: 'all 0.25s ease',
                                                    color: selectedPost.comments_enabled !== false ? '#ff3366' : 'rgba(255,255,255,0.4)',
                                                    fontSize: '0.72rem', fontWeight: 700,
                                                    letterSpacing: '0.3px'
                                                }}
                                            >
                                                {selectedPost.comments_enabled !== false ? (
                                                    <>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                        Comments On
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                            <line x1="2" y1="2" x2="22" y2="22" />
                                                        </svg>
                                                        Comments Off
                                                    </>
                                                )}
                                            </button>
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

            {/* ── Edit Post Modal ────────────────────────────────────────── */}
            <Modal
                show={!!editPost}
                onHide={closeEditModal}
                size="lg"
                centered
                contentClassName="edit-post-modal-content"
            >
                <Modal.Header closeButton style={{ background: '#0d0e15', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Edit Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#0d0e15', color: '#fff' }}>
                    {editSuccess ? (
                        <Alert variant="success" className="text-center py-4">
                            <h5 className="mb-1">✓ Updated!</h5>
                            <p className="mb-0 small">Post updated and submitted for re-approval.</p>
                        </Alert>
                    ) : (
                        <Form onSubmit={handleEditSubmit}>
                            {editError && <Alert variant="danger" className="small py-2">{editError}</Alert>}
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small text-secondary">Title</Form.Label>
                                        <Form.Control
                                            name="title" value={editForm.title || ''}
                                            onChange={handleEditFieldChange} required
                                            style={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small text-secondary">Post Type</Form.Label>
                                        <Form.Select
                                            name="post_type" value={editForm.post_type || 'UPDATE'}
                                            onChange={handleEditFieldChange}
                                            style={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        >
                                            <option value="UPDATE">Standard Update</option>
                                            <option value="MILESTONE">Milestone / Achievement</option>
                                            <option value="PRODUCT_DEMO">Product Showcase / Demo</option>
                                            <option value="NEWS">News / Press Release</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small text-secondary">Description</Form.Label>
                                        <Form.Control
                                            as="textarea" rows={4} name="content"
                                            value={editForm.content || ''} onChange={handleEditFieldChange}
                                            style={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', resize: 'none' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="small text-secondary">Demo Link</Form.Label>
                                        <Form.Control
                                            type="url" name="demo_link" value={editForm.demo_link || ''}
                                            onChange={handleEditFieldChange} placeholder="https://..."
                                            style={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small text-secondary">External Link</Form.Label>
                                        <Form.Control
                                            type="url" name="external_link" value={editForm.external_link || ''}
                                            onChange={handleEditFieldChange} placeholder="https://..."
                                            style={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        />
                                    </Form.Group>
                                    <div className="d-flex align-items-center justify-content-between p-2"
                                        style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <span className="small text-secondary">Allow Comments</span>
                                        <div
                                            onClick={() => setEditForm(p => ({ ...p, comments_enabled: !p.comments_enabled }))}
                                            style={{
                                                width: 42, height: 24, borderRadius: 12,
                                                background: editForm.comments_enabled ? '#10b981' : 'rgba(255,255,255,0.1)',
                                                cursor: 'pointer', position: 'relative', transition: 'background 0.25s'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute', top: 3,
                                                left: editForm.comments_enabled ? 20 : 3,
                                                width: 18, height: 18, borderRadius: '50%',
                                                background: '#fff', transition: 'left 0.25s'
                                            }} />
                                        </div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <Form.Label className="small text-secondary d-flex justify-content-between mb-2">
                                        <span>Media</span>
                                        <span style={{ color: '#555' }}>{editExistingUrls.length + editNewFiles.length}/10</span>
                                    </Form.Label>

                                    {editExistingUrls.length > 0 && (
                                        <div className="mb-2">
                                            <p className="mb-1" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Media — click × to remove</p>
                                            <div className="edit-media-strip">
                                                {editExistingUrls.map((url, i) => (
                                                    <div key={i} className="edit-media-thumb">
                                                        {url.includes('.mp4') || url.includes('.mov') || url.includes('.webm')
                                                            ? <video src={url} muted />
                                                            : <img src={url} alt={`media-${i}`} />
                                                        }
                                                        <button type="button" className="edit-media-remove" onClick={() => removeEditExisting(i)}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {editNewPreviews.length > 0 && (
                                        <div className="mb-2">
                                            <p className="mb-1" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Files</p>
                                            <div className="edit-media-strip">
                                                {editNewPreviews.map((p, i) => (
                                                    <div key={i} className="edit-media-thumb new">
                                                        {p.type.startsWith('video')
                                                            ? <video src={p.url} muted />
                                                            : <img src={p.url} alt={`new-${i}`} />
                                                        }
                                                        <button type="button" className="edit-media-remove" onClick={() => removeEditNew(i)}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(editExistingUrls.length + editNewFiles.length) < 10 && (
                                        <button
                                            type="button"
                                            className="edit-add-media-btn"
                                            onClick={() => editFileRef.current?.click()}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Add Media Files
                                        </button>
                                    )}
                                    <input
                                        ref={editFileRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="d-none"
                                        onChange={handleEditMediaChange}
                                    />

                                    <div className="mt-3 p-2" style={{ background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
                                        <p className="mb-0" style={{ color: '#f59e0b', fontSize: '0.72rem' }}>
                                            ⚠ Saving will reset the post status to <strong>PENDING</strong> for re-approval.
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                <Button variant="outline-secondary" size="sm" onClick={closeEditModal} disabled={editLoading}
                                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#aaa' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm" disabled={editLoading}
                                    style={{ background: '#0ea5e9', border: 'none', fontWeight: 600, padding: '6px 20px' }}>
                                    {editLoading ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* ── Delete Confirm Modal ────────────────────────────────────────── */}
            <Modal
                show={!!deletePostTarget}
                onHide={() => { if (!deleteLoading) setDeletePostTarget(null); }}
                centered
                size="sm"
                contentClassName="edit-post-modal-content"
            >
                <Modal.Header closeButton style={{ background: '#0d0e15', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Modal.Title style={{ fontSize: '1rem', fontWeight: 700 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Delete Post
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#0d0e15', color: '#fff' }}>
                    {deleteError && <Alert variant="danger" className="small py-2 mb-3">{deleteError}</Alert>}
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                        Are you sure you want to delete <strong className="text-white">"{deletePostTarget?.title}"</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button
                            variant="outline-secondary" size="sm"
                            onClick={() => setDeletePostTarget(null)}
                            disabled={deleteLoading}
                            style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#aaa' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm" onClick={handleDeletePost} disabled={deleteLoading}
                            style={{ background: '#ef4444', border: 'none', fontWeight: 600, padding: '6px 20px' }}
                        >
                            {deleteLoading
                                ? <><Spinner animation="border" size="sm" className="me-2" />Deleting...</>
                                : 'Delete'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── Delete Startup Confirmation Modal ──────────────────── */}
            <Modal
                show={deleteStartupOpen}
                onHide={() => { if (!deleteStartupLoading) setDeleteStartupOpen(false); }}
                centered
                contentClassName="edit-post-modal-content"
            >
                <Modal.Header closeButton style={{ background: '#0d0e15', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Modal.Title style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Delete Startup
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: '#0d0e15', color: '#fff' }}>
                    {deleteStartupError && <Alert variant="danger" className="small py-2 mb-3">{deleteStartupError}</Alert>}
                    <p className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>
                        Are you sure you want to permanently delete
                        <strong className="text-white"> "{startup?.name}"</strong>?
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.82rem', color: '#ef4444', opacity: 0.85 }}>
                        ⚠️ This will delete all posts, founders, metrics, and views. This cannot be undone.
                    </p>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button
                            variant="outline-secondary" size="sm"
                            onClick={() => setDeleteStartupOpen(false)}
                            disabled={deleteStartupLoading}
                            style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#aaa' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleDeleteStartup}
                            disabled={deleteStartupLoading}
                            style={{ background: '#ef4444', border: 'none', fontWeight: 600, padding: '6px 22px' }}
                        >
                            {deleteStartupLoading
                                ? <><Spinner animation="border" size="sm" className="me-2" />Deleting...</>
                                : 'Yes, Delete Everything'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MyStartupDetails;
