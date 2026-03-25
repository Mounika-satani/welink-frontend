import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../service/api';
import { trackPostView } from '../service/post';
import CommentsSection from './sections/CommentsSection';

const UpvoteSVG = ({ filled }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" />
    </svg>
);

const CommentSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const SendSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const ViewTracker = ({ postId, token }) => {
    const tracked = React.useRef(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
        if (!postId || tracked.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !tracked.current) {
                const timer = setTimeout(() => {
                    if (entries[0].isIntersecting && !tracked.current) {
                        trackPostView(token, postId).catch(() => { });
                        tracked.current = true;
                    }
                }, 1500);
                return () => clearTimeout(timer);
            }
        }, { threshold: 0.6 });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [postId, token]);

    return <div ref={containerRef} style={{ height: '1px', width: '100%', position: 'absolute', top: '50%' }} />;
};

const MediaCarousel = ({ urls, mediaType }) => {
    const [idx, setIdx] = useState(0);
    const isVid = (url) => /\.(mp4|mov|webm|ogg)(\?|$)/i.test(url) || mediaType === 'VIDEO';
    const current = urls[idx];

    return (
        <div className="li-media-container">
            {isVid(current) ? (
                <video key={current} src={current} className="li-media-el" controls playsInline />
            ) : (
                <img src={current} alt={`Post media ${idx + 1}`} className="li-media-el" />
            )}
            {urls.length > 1 && (
                <>
                    <button className="carousel-arrow carousel-prev" onClick={() => setIdx(i => Math.max(0, i - 1))}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button className="carousel-arrow carousel-next" onClick={() => setIdx(i => Math.min(urls.length - 1, i + 1))}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                    <div className="li-carousel-counter">{idx + 1} / {urls.length}</div>
                </>
            )}
        </div>
    );
};

const PostCard = ({ post, currentUser, token, isModal = false }) => {
    const userId = currentUser?.id;
    const [votes, setVotes] = useState({ upvotes: post.metrics?.total_upvotes || 0, userVote: post.userVote || null });
    const [showComments, setShowComments] = useState(isModal);
    const [expanded, setExpanded] = useState(isModal);
    const commentsEnabled = post.comments_enabled !== false;

    useEffect(() => {
        if (!post.id) return;
        // Optimization: Use already fetched metrics if available, but fetch fresh userVote if not in prop
        if (post.userVote === undefined && userId) {
            fetch(`${API_URL}/post-votes/${post.id}?user_id=${userId}`)
                .then(r => r.json())
                .then(d => setVotes({
                    upvotes: d.upvotes ?? votes.upvotes,
                    userVote: d.userVote ?? null
                }))
                .catch(() => { });
        }
    }, [post.id, userId, post.userVote]);

    const handleVote = async (type) => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_URL}/post-votes/cast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ user_id: userId, post_id: post.id, vote_type: type }),
            });
            const d = await res.json();
            if (res.ok) setVotes({
                upvotes: d.upvotes ?? votes.upvotes,
                userVote: d.userVote !== undefined ? d.userVote : null,
            });
        } catch (e) { }
    };

    const mediaUrls = post.media_urls?.length > 0 ? post.media_urls : (post.media_url ? [post.media_url] : []);
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        return Math.floor(hours / 24) + 'd';
    };

    return (
        <div className={`li-card ${isModal ? 'is-modal' : ''}`}>
            {!isModal && <ViewTracker postId={post.id} token={token} />}
            <div className="li-post-header">
                <Link to={`/startup/${post.startup_id}`} className="li-header-left">
                    <img src={post.startup?.logo_url || 'https://via.placeholder.com/48'} alt="" className="li-avatar" />
                    <div className="li-user-info">
                        <span className="li-name">{post.startup?.name}</span>
                        <span className="li-tagline">{post.startup?.tagline}</span>
                        <div className="li-post-meta">
                            <span>{timeAgo(post.createdAt || new Date())}</span>
                            <span>•</span>
                            <div className="li-view-count">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                                <span>{post.metrics?.total_views || 0}</span>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="li-header-right">
                    <button className="li-icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    </button>
                </div>
            </div>

            <div className="li-post-body">
                {post.title && <div className="li-post-title">{post.title}</div>}
                {post.content && (
                    <div className={`li-post-text ${expanded ? 'expanded' : ''}`}>
                        {post.content}
                        {!expanded && post.content.length > 150 && (
                            <button className="li-see-more" onClick={() => setExpanded(true)}>...see more</button>
                        )}
                    </div>
                )}
            </div>

            {mediaUrls.length > 0 ? (
                <MediaCarousel urls={mediaUrls} mediaType={post.media_type} />
            ) : (post.external_link || post.demo_link) && (
                <a href={post.external_link || post.demo_link} target="_blank" rel="noopener noreferrer" className="li-link-card">
                    <span className="li-link-domain">{new URL(post.external_link || post.demo_link).hostname}</span>
                    <span className="li-link-title">{post.title || 'View Resource'}</span>
                </a>
            )}

            <div className="li-actions-bar">
                <button className={`li-action-btn ${votes.userVote === 1 ? 'active' : ''}`} onClick={() => handleVote(1)}>
                    <UpvoteSVG filled={votes.userVote === 1} />
                    <span>{votes.upvotes > 0 ? votes.upvotes : ''} Upvote</span>
                </button>

                {commentsEnabled && (
                    <>
                        <div className="li-action-sep" />
                        <button className="li-action-btn" onClick={() => setShowComments(!showComments)}>
                            <CommentSVG />
                            <span>{post.comments_count > 0 ? `${post.comments_count} Comment${post.comments_count !== 1 ? 's' : ''}` : 'Comment'}</span>
                        </button>
                    </>
                )}
                <div className="li-action-sep" />
                <button className="li-action-btn" onClick={() => navigator.share?.({ url: window.location.href }) ?? navigator.clipboard?.writeText(window.location.href)}>
                    <SendSVG />
                    <span>Share</span>
                </button>
            </div>

            {showComments && commentsEnabled && (
                <div className="li-comments-section">
                    <CommentsSection postId={post.id} dbUser={currentUser} token={token} startupOwnerId={post.startup?.owner_user_id || null} />
                </div>
            )}
        </div>
    );
};

export default PostCard;
