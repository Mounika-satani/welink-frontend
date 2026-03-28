import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts, trackPostView } from '../service/post';
import { API_URL } from '../service/api';
import CommentsSection from '../components/sections/CommentsSection';
import CreatePostModal from '../components/CreatePostModal';
import './Feed.css';

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

                <div className="li-pill-input" onClick={onOpenModal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Start your story...</span>
                    <div className="li-pill-add-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px', marginRight: '6px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

import PostCard from '../components/PostCard';

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
