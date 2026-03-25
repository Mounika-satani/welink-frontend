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

                <div className="li-pill-input" onClick={onOpenModal}>
                    Start your story...
                </div>

                <div className="li-pill-actions">
                    <button className="li-pill-btn" title="News" onClick={onOpenModal}>
                        <svg viewBox="0 0 24 24"><path d="M17 3H7a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4zm-2 12H9v-2h6v2zm0-4H9V9h6v2z" /></svg>
                    </button>
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
