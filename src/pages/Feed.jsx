
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts } from '../service/post';
import { API_URL } from '../service/api';
import CommentsSection from '../components/sections/CommentsSection';
import './Feed.css';

const ThumbUpSVG = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
);
const ThumbDownSVG = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
        <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
);
const CommentSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const ShareSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

function fmtNum(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n ?? 0;
}

/* ── Right-side action button (like YouTube Shorts) ─────── */
const ActionBtn = ({ icon, label, onClick, active, activeColor }) => (
    <button
        className="yt-action-btn"
        onClick={onClick}
        style={active ? { '--act-color': activeColor } : {}}
        data-active={active ? 'true' : undefined}
    >
        <div className="yt-action-circle">{icon}</div>
        <span className="yt-action-label">{label}</span>
    </button>
);

/* ── Per-post Vote + Actions Panel ─────────────────────── */
const ActionsPanel = ({ postId, userId, token, onComment, commentsEnabled }) => {
    const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0, userVote: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!postId) return;
        fetch(`${API_URL}/post-votes/${postId}${userId ? `?user_id=${userId}` : ''}`)
            .then(r => r.json())
            .then(d => setVotes({ upvotes: d.upvotes ?? 0, downvotes: d.downvotes ?? 0, userVote: d.userVote ?? null }))
            .catch(() => { });
    }, [postId, userId]);

    const vote = useCallback(async (type) => {
        if (!userId || loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/post-votes/cast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ user_id: userId, post_id: postId, vote_type: type }),
            });
            const d = await res.json();
            if (res.ok) setVotes({ upvotes: d.upvotes ?? votes.upvotes, downvotes: d.downvotes ?? votes.downvotes, userVote: d.userVote ?? null });
        } finally { setLoading(false); }
    }, [userId, loading, postId, token, votes]);

    return (
        <div className="yt-actions-panel">
            <ActionBtn icon={<ThumbUpSVG filled={votes.userVote === 1} />} label={fmtNum(votes.upvotes)}
                onClick={() => vote(1)} active={votes.userVote === 1} activeColor="#22c55e" />
            <ActionBtn icon={<ThumbDownSVG filled={votes.userVote === -1} />} label="Dislike"
                onClick={() => vote(-1)} active={votes.userVote === -1} activeColor="#f43f5e" />
            {commentsEnabled && (
                <ActionBtn icon={<CommentSVG />} label="Comments" onClick={onComment} />
            )}
            <ActionBtn icon={<ShareSVG />} label="Share"
                onClick={() => navigator.share?.({ url: window.location.href }) ?? navigator.clipboard?.writeText(window.location.href)} />
        </div>
    );
};

/* ── Media Carousel (Instagram-style) ───────────────────── */
const MediaCarousel = ({ urls, mediaType, isActive }) => {
    const [idx, setIdx] = useState(0);
    const videoRefs = useRef([]);

    useEffect(() => {
        urls.forEach((_, i) => {
            const v = videoRefs.current[i];
            if (!v) return;
            if (isActive && i === idx) v.play().catch(() => { });
            else v.pause();
        });
    }, [isActive, idx, urls]);

    const prev = (e) => { e.stopPropagation(); setIdx(i => Math.max(0, i - 1)); };
    const next = (e) => { e.stopPropagation(); setIdx(i => Math.min(urls.length - 1, i + 1)); };

    const isVid = (url) => /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url) || mediaType === 'VIDEO';
    const current = urls[idx];

    return (
        <div className="media-carousel">
            {isVid(current) ? (
                <video key={current} ref={el => (videoRefs.current[idx] = el)}
                    src={current} className="yt-media-el" loop muted playsInline />
            ) : (
                <img src={current} alt={`Slide ${idx + 1}`} className="yt-media-el" />
            )}
            {idx > 0 && (
                <button className="carousel-arrow carousel-prev" onClick={prev}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
            )}
            {idx < urls.length - 1 && (
                <button className="carousel-arrow carousel-next" onClick={next}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            )}
            <div className="carousel-dots">
                {urls.map((_, i) => (
                    <button key={i} className={`carousel-dot ${i === idx ? 'active' : ''}`}
                        onClick={e => { e.stopPropagation(); setIdx(i); }} />
                ))}
            </div>
            <div className="carousel-counter">{idx + 1} / {urls.length}</div>
        </div>
    );
};

/* ── Single Shorts Card ──────────────────────────────────── */
const ShortsCard = ({ post, userId, token, isActive }) => {
    const commentsEnabled = post.comments_enabled !== false; // default true for older posts
    const [showComments, setShowComments] = useState(false);
    const [muted, setMuted] = useState(true);
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef(null);

    const mediaUrls = post.media_urls?.length > 0 ? post.media_urls : (post.media_url ? [post.media_url] : []);
    const isMulti = mediaUrls.length > 1;
    const isVideo = post.media_type === 'VIDEO';

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) { videoRef.current.pause(); setPlaying(false); }
        else { videoRef.current.play(); setPlaying(true); }
    };

    // Auto-play/pause single-video card
    useEffect(() => {
        if (isMulti || !videoRef.current) return;
        if (isActive && isVideo) {
            videoRef.current.play().then(() => setPlaying(true)).catch(() => { });
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    }, [isActive, isMulti, isVideo]);

    return (
        <div className="yt-card">
            {/* ── Media area ── */}
            <div className="yt-media" onClick={(!isMulti && isVideo) ? togglePlay : undefined}>
                {mediaUrls.length > 0 ? (
                    isMulti ? (
                        /* Instagram-style carousel */
                        <MediaCarousel urls={mediaUrls} mediaType={post.media_type} isActive={isActive} />
                    ) : isVideo ? (
                        <video ref={videoRef} src={mediaUrls[0]} className="yt-media-el"
                            loop muted={muted} playsInline poster={post.thumbnail_url} />
                    ) : (
                        <img src={mediaUrls[0]} alt={post.title} className="yt-media-el" />
                    )
                ) : (
                    <div className="yt-no-media">
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                )}

                {/* dark gradient */}
                <div className="yt-gradient" />

                {/* top controls bar — only for single-video */}
                {!isMulti && isVideo && (
                    <div className="yt-top-bar">
                        <button className="yt-ctrl" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                            {playing
                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21" /></svg>}
                        </button>
                        <button className="yt-ctrl" onClick={(e) => { e.stopPropagation(); setMuted(m => !m); }}>
                            {muted
                                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>}
                        </button>
                        <div className="yt-menu-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                        </div>
                    </div>
                )}

                {/* paused overlay */}
                {isVideo && !playing && (
                    <div className="yt-pause-overlay" onClick={togglePlay}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.85"><polygon points="5 3 19 12 5 21" /></svg>
                    </div>
                )}

                {/* bottom info */}
                <div className="yt-bottom-info">
                    <Link to={`/startup/${post.startup_id}`} className="yt-startup-row" onClick={e => e.stopPropagation()}>
                        <img src={post.startup?.logo_url || 'https://via.placeholder.com/36'} alt="" className="yt-avatar" />
                        <div>
                            <div className="yt-startup-name">{post.startup?.name}</div>
                            <div className="yt-startup-tag">{post.startup?.tagline}</div>
                        </div>
                    </Link>
                    <div className="yt-post-title">{post.title}</div>
                    {post.content && <div className="yt-post-content">{post.content}</div>}
                    <div className="yt-meta-row">
                        <span className="yt-post-type">{post.post_type}</span>
                        {post.demo_link && <a href={post.demo_link} target="_blank" rel="noopener noreferrer" className="yt-link">Live Demo ↗</a>}
                        {post.external_link && <a href={post.external_link} target="_blank" rel="noopener noreferrer" className="yt-link yt-link-alt">Learn More ↗</a>}
                        {!commentsEnabled && (
                            <span className="yt-comments-off-badge">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    <line x1="2" y1="2" x2="22" y2="22" />
                                </svg>
                                Comments off
                            </span>
                        )}
                    </div>
                </div>

                {/* comments drawer — only when enabled */}
                {commentsEnabled && showComments && (
                    <div className="yt-comments-drawer" onClick={e => e.stopPropagation()}>
                        <div className="yt-comments-hdr">
                            <span>Comments</span>
                            <button className="yt-comments-close" onClick={() => setShowComments(false)}>✕</button>
                        </div>
                        <div className="yt-comments-body">
                            <CommentsSection postId={post.id} dbUser={{ id: userId }} token={token}
                                startupOwnerId={post.startup?.owner_user_id || null} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Right action panel ── */}
            <ActionsPanel postId={post.id} userId={userId} token={token}
                commentsEnabled={commentsEnabled}
                onComment={() => commentsEnabled && setShowComments(s => !s)} />
        </div>
    );
};

/* ── Feed Page ───────────────────────────────────────────── */
const Feed = () => {
    const { token, dbUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        getAllPosts(token)
            .then(data => setPosts(data))
            .catch(() => setError('Failed to load feed.'))
            .finally(() => setLoading(false));
    }, [token]);

    /* Intersection observer → track which card is visible */
    useEffect(() => {
        if (!scrollRef.current || posts.length === 0) return;
        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        const idx = itemRefs.current.indexOf(e.target);
                        if (idx !== -1) setActiveIdx(idx);
                    }
                });
            },
            { root: scrollRef.current, threshold: 0.6 }
        );
        itemRefs.current.forEach(el => el && obs.observe(el));
        return () => obs.disconnect();
    }, [posts]);

    if (loading) return (
        <div className="yt-feed">
            <div className="yt-state">
                <div className="yt-spinner" />
                <p>Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="yt-feed">
            <div className="yt-state"><p style={{ color: '#ff3366' }}>{error}</p></div>
        </div>
    );

    if (posts.length === 0) return (
        <div className="yt-feed">
            <div className="yt-state">
                <h3>No posts yet 🚀</h3>
                <Link to="/discover" className="yt-discover-btn">Discover Startups</Link>
            </div>
        </div>
    );

    return (
        <div className="yt-feed" ref={scrollRef}>
            {posts.map((post, i) => (
                <div
                    key={post.id}
                    className="yt-snap-item"
                    ref={el => (itemRefs.current[i] = el)}
                >
                    <ShortsCard
                        post={post}
                        userId={dbUser?.id || null}
                        token={token}
                        isActive={i === activeIdx}
                    />
                </div>
            ))}
        </div>
    );
};

export default Feed;
