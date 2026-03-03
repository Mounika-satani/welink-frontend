import React, { useState, useEffect, useCallback } from 'react';
import {
    getComments, getAllComments,
    addComment, voteComment,
    deleteComment, hideComment, restoreComment,
} from '../../service/comment';
import './CommentsSection.css';

/* ── Helpers ──────────────────────────────────── */
function timeAgo(dateString) {
    const secs = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
}

function authorLabel(author) {
    if (!author) return 'Anonymous';
    return (author.email || '').split('@')[0] || 'User';
}

/* ── Comment Vote Bar ─────────────────────────── */
const CommentVoteBar = ({ comment, dbUser, token }) => {
    const [voting, setVoting] = useState(false);
    const [localUp, setLocalUp] = useState(comment.upvotes ?? 0);
    const [localDown, setLocalDown] = useState(comment.downvotes ?? 0);
    const [userVote, setUserVote] = useState(comment.userVote ?? null);

    const handleVote = useCallback(async (voteType) => {
        if (!dbUser || voting) return;
        setVoting(true);
        try {
            const data = await voteComment(token, comment.id, voteType);
            setLocalUp(data.upvotes ?? localUp);
            setLocalDown(data.downvotes ?? localDown);
            setUserVote(data.userVote ?? null);
        } catch (err) {
            console.error('Comment vote failed:', err);
        } finally {
            setVoting(false);
        }
    }, [dbUser, voting, token, comment.id]);

    return (
        <div className="comment-actions">
            <button
                className={`comment-vote-btn ${userVote === 1 ? 'up-active' : ''}`}
                onClick={() => handleVote(1)}
                disabled={!dbUser || voting || comment.status === 'HIDDEN'}
                title={dbUser ? 'Upvote' : 'Login to vote'}
            >
                <svg width="12" height="12" viewBox="0 0 24 24"
                    fill={userVote === 1 ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span>{localUp}</span>
            </button>

            <div className="comment-vote-sep" />

            <button
                className={`comment-vote-btn ${userVote === -1 ? 'down-active' : ''}`}
                onClick={() => handleVote(-1)}
                disabled={!dbUser || voting || comment.status === 'HIDDEN'}
                title={dbUser ? 'Downvote' : 'Login to vote'}
            >
                <svg width="12" height="12" viewBox="0 0 24 24"
                    fill={userVote === -1 ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
                <span>{localDown}</span>
            </button>
        </div>
    );
};

/* ── Main CommentsSection ─────────────────────── */
const CommentsSection = ({ postId, dbUser, token, startupOwnerId }) => {
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [posting, setPosting] = useState(false);

    const isOwner = !!(dbUser && startupOwnerId && dbUser.id === startupOwnerId);

    /* Fetch on first open — owners get all (incl. hidden), others get active only */
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        const fetchFn = isOwner
            ? getAllComments(token, postId)
            : getComments(postId, dbUser?.id);

        fetchFn
            .then(setComments)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [open, postId, isOwner]);

    const handleSubmit = async () => {
        if (!text.trim() || posting) return;
        setPosting(true);
        try {
            const newComment = await addComment(token, postId, text.trim());
            setComments(prev => [newComment, ...prev]);
            setText('');
        } catch (err) {
            console.error('Submit comment error:', err);
        } finally {
            setPosting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    };

    /* Hard delete */
    const handleDelete = async (commentId) => {
        try {
            await deleteComment(token, commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Delete comment error:', err);
        }
    };

    /* Soft hide — keep comment in list but flip its status to HIDDEN */
    const handleHide = async (commentId) => {
        try {
            await hideComment(token, commentId);
            setComments(prev =>
                prev.map(c => c.id === commentId ? { ...c, status: 'HIDDEN' } : c)
            );
        } catch (err) {
            console.error('Hide comment error:', err);
        }
    };

    /* Restore hidden → ACTIVE */
    const handleRestore = async (commentId) => {
        try {
            await restoreComment(token, commentId);
            setComments(prev =>
                prev.map(c => c.id === commentId ? { ...c, status: 'ACTIVE' } : c)
            );
        } catch (err) {
            console.error('Restore comment error:', err);
        }
    };

    const activeCount = comments.filter(c => c.status === 'ACTIVE').length;
    const hiddenCount = comments.filter(c => c.status === 'HIDDEN').length;

    return (
        <div className="comments-section">
            {/* Toggle bar */}
            <button className="comments-toggle-btn" onClick={() => setOpen(o => !o)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {open ? 'Hide comments' : 'Comments'}
                <span className="comments-count-badge">
                    {open
                        ? (isOwner && hiddenCount > 0 ? `${activeCount} active · ${hiddenCount} hidden` : activeCount)
                        : (comments.length > 0 ? comments.length : '…')}
                </span>
            </button>

            {open && (
                <div className="comments-body">
                    {/* Input */}
                    {dbUser ? (
                        <div className="comment-input-row">
                            <textarea
                                className="comment-input"
                                placeholder="Write a comment…"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                            <button
                                className="comment-submit-btn"
                                onClick={handleSubmit}
                                disabled={!text.trim() || posting}
                            >
                                {posting ? '…' : 'Post'}
                            </button>
                        </div>
                    ) : (
                        <p className="comment-login-hint">Login to post a comment</p>
                    )}

                    {/* Comment list */}
                    {loading ? (
                        <p className="comments-loading">Loading comments…</p>
                    ) : comments.length === 0 ? (
                        <p className="comments-empty">No comments yet. Be the first!</p>
                    ) : (
                        <div className="comment-list">
                            {comments.map(comment => {
                                const isHidden = comment.status === 'HIDDEN';
                                const isAuthor = dbUser?.id === comment.user_id;
                                const canDelete = isOwner || isAuthor;
                                const canHide = isOwner && !isHidden;
                                const canRestore = isOwner && isHidden;

                                return (
                                    <div
                                        key={comment.id}
                                        className={`comment-item ${isHidden ? 'comment-item--hidden' : ''}`}
                                    >
                                        {/* Hidden notice banner — only startup owner sees this */}
                                        {isHidden && isOwner && (
                                            <div className="comment-hidden-banner">
                                                🚫 Hidden from public — only you can see this
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className="comment-header">
                                            <img
                                                className="comment-avatar"
                                                src={comment.author?.photo_url ||
                                                    `https://ui-avatars.com/api/?name=${authorLabel(comment.author)}&background=222&color=fff&size=64`}
                                                alt={authorLabel(comment.author)}
                                                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=222&color=fff&size=64`; }}
                                            />
                                            <span className="comment-author-name">{authorLabel(comment.author)}</span>
                                            <span className="comment-date">{timeAgo(comment.created_at || comment.createdAt)}</span>
                                        </div>

                                        {/* Text */}
                                        <p className="comment-text">{comment.content}</p>

                                        {/* Actions row: votes left, owner controls right */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <CommentVoteBar
                                                comment={comment}
                                                dbUser={dbUser}
                                                token={token}
                                            />
                                            {(canHide || canRestore || canDelete) && (
                                                <div className="comment-actions comment-owner-actions" style={{ marginTop: 0 }}>
                                                    {canRestore && (
                                                        <button
                                                            className="comment-restore-btn"
                                                            onClick={() => handleRestore(comment.id)}
                                                            title="Make this comment visible again"
                                                        >
                                                            ↩ Restore
                                                        </button>
                                                    )}
                                                    {canHide && (
                                                        <button
                                                            className="comment-hide-btn"
                                                            onClick={() => handleHide(comment.id)}
                                                            title="Hide this comment from public"
                                                        >
                                                            🚫 Hide
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            className="comment-delete-btn"
                                                            onClick={() => handleDelete(comment.id)}
                                                            title="Permanently delete"
                                                        >
                                                            🗑 Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
