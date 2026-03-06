
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts } from '../service/post';
import { API_URL } from '../service/api';
import CommentsSection from '../components/sections/CommentsSection';
import CreatePostModal from '../components/CreatePostModal';
import './Feed.css';

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

const CreatePostHeader = ({ dbUser, onOpenModal }) => {
    const displayName = dbUser?.name || dbUser?.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const photoUrl = dbUser?.photo_url;

    return (
        <div className="li-create-pill-container">
            <div className="li-create-pill">
                <Link to="/profile" className="li-pill-avatar-link">
                    {photoUrl ? (
                        <img src={photoUrl} alt={displayName} className="li-pill-avatar" />
                    ) : (
                        <div className="li-pill-avatar li-pill-fallback">{initials}</div>
                    )}
                </Link>

                <div className="li-pill-input" onClick={onOpenModal}>
                    Start your story...
                </div>

                <div className="li-pill-actions">
                    <button className="li-pill-btn" title="Photo" onClick={onOpenModal}>
                        <svg viewBox="0 0 24 24"><path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-1 9l-3.5-4.5-2.5 3L10 9l-4 5h12z" /></svg>
                    </button>
                    <button className="li-pill-btn" title="Video" onClick={onOpenModal}>
                        <svg viewBox="0 0 24 24"><path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm-9 12V8l6 4-6 4z" /></svg>
                    </button>
                    <button className="li-pill-btn" title="News" onClick={onOpenModal}>
                        <svg viewBox="0 0 24 24"><path d="M17 3H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4zm-2 12H9v-2h6v2zm0-4H9V9h6v2z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
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

const PostCard = ({ post, currentUser, token }) => {
    const userId = currentUser?.id;
    const [votes, setVotes] = useState({ upvotes: 0, userVote: null });
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const commentsEnabled = post.comments_enabled !== false;

    useEffect(() => {
        if (!post.id) return;
        fetch(`${API_URL}/post-votes/${post.id}${userId ? `?user_id=${userId}` : ''}`)
            .then(r => r.json())
            .then(d => setVotes({
                upvotes: d.upvotes ?? 0,
                userVote: d.userVote ?? null
            }))
            .catch(() => { });
    }, [post.id, userId]);

    const handleVote = async (type) => {
        if (!userId) return;
        // If clicking the same button, remove vote (type 0), else cast new type
        const newType = votes.userVote === type ? 0 : type;
        try {
            const res = await fetch(`${API_URL}/post-votes/cast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ user_id: userId, post_id: post.id, vote_type: newType }),
            });
            const d = await res.json();
            if (res.ok) setVotes({
                upvotes: d.upvotes ?? votes.upvotes,
                userVote: d.userVote ?? null
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
        <div className="li-card">
            <div className="li-post-header">
                <Link to={`/startup/${post.startup_id}`} className="li-header-left">
                    <img src={post.startup?.logo_url || 'https://via.placeholder.com/48'} alt="" className="li-avatar" />
                    <div className="li-user-info">
                        <span className="li-name">{post.startup?.name}</span>
                        <span className="li-tagline">{post.startup?.tagline}</span>
                        <div className="li-post-meta">
                            <span>{timeAgo(post.createdAt || new Date())}</span>
                            <span>•</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
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
                            <span>Comment</span>
                        </button>
                    </>
                )}
                <div className="li-action-sep" />
                <button className="li-action-btn" onClick={() => navigator.share?.({ url: window.location.href }) ?? navigator.clipboard?.writeText(window.location.href)}>
                    <SendSVG />
                    <span>Send</span>
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

const Feed = () => {
    const { token, dbUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);

    useEffect(() => {
        getAllPosts(token)
            .then(data => setPosts(data))
            .catch(() => setError('Failed to load feed.'))
            .finally(() => setLoading(false));
    }, [token]);


    if (loading) return (
        <div className="yt-feed">
            <div className="yt-state">
                <div className="yt-spinner" />
                <p>Loading your professional feed...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="yt-feed">
            <div className="yt-state"><p style={{ color: '#ff3366' }}>{error}</p></div>
        </div>
    );

    return (
        <div className="yt-feed">
            <CreatePostHeader dbUser={dbUser} onOpenModal={() => setShowPostModal(true)} />

            {posts.length === 0 ? (
                <div className="yt-state">
                    <h3>No posts yet 🚀</h3>
                    <Link to="/discover" className="yt-discover-btn">Discover Startups</Link>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="yt-snap-item">
                        <PostCard
                            post={post}
                            currentUser={dbUser}
                            token={token}
                        />
                    </div>
                ))
            )}

            <CreatePostModal
                show={showPostModal}
                onHide={() => setShowPostModal(false)}
            />
        </div>
    );
}

export default Feed;
