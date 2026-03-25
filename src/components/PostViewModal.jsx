import React from 'react';
import PostCard from './PostCard';
import './PostViewModal.css';

const PostViewModal = ({ post, show, onHide, currentUser, token }) => {
    if (!show || !post) return null;

    return (
        <div className="post-modal-overlay" onClick={onHide}>
            <div className="post-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="post-modal-close" onClick={onHide}>&times;</button>
                <div className="post-modal-scrollable">
                    <PostCard
                        post={post}
                        currentUser={currentUser}
                        token={token}
                        isModal={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostViewModal;
