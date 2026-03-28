import React, { useState, useEffect, useCallback } from 'react';
import {
    getComments, getAllComments,
    addComment, voteComment,
    deleteComment, hideComment, restoreComment, updateComment
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

    // For STARTUP role
    if (author.role === 'STARTUP' && author.startup) {
        // Fallback 1: Founder name
        if (author.startup.founders?.length > 0 && author.startup.founders[0]?.name) {
            return author.startup.founders[0].name;
        }
        // Fallback 2: Startup name
        if (author.startup.name) {
            return author.startup.name;
        }
    }

    // Fallback 3: For USER role or missing names
    return (author.email || '').split('@')[0] || 'User';
}

/* ── Comment Vote Bar ─────────────────────────── */
const CommentVoteBar = ({ comment, dbUser, token }) => {
    const [voting, setVoting] = useState(false);
    const [localUp, setLocalUp] = useState(comment.upvotes ?? 0);
    const [userVote, setUserVote] = useState(comment.userVote ?? null);

    const handleVote = useCallback(async (voteType) => {
        if (!dbUser || voting) return;
        setVoting(true);
        try {
            const data = await voteComment(token, comment.id, voteType);
            setLocalUp(data.upvotes ?? localUp);
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
                <svg width="16" height="16" viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" />
                </svg>
                <span>{localUp}</span>
            </button>
        </div>
    );
};

/* ── Main CommentsSection ─────────────────────── */
const CommentsSection = ({ postId, dbUser, token, startupOwnerId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [posting, setPosting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const isOwner = !!(dbUser && startupOwnerId && dbUser.id === startupOwnerId);

    /* Fetch on first open — owners get all (incl. hidden), others get active only */
    useEffect(() => {
        setLoading(true);
        const fetchFn = isOwner
            ? getAllComments(token, postId)
            : getComments(postId, dbUser?.id);

        fetchFn
            .then(setComments)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [postId, isOwner, token, dbUser?.id]);

    const handleSubmit = async (parentId = null) => {
        const content = parentId ? replyText : text;
        if (!content.trim() || posting) return;
        setPosting(true);
        setErrorMsg(null);
        try {
            const newComment = await addComment(token, postId, content.trim(), parentId);
            setComments(prev => [newComment, ...prev]);
            if (parentId) {
                setReplyText('');
                setReplyingTo(null);
            } else {
                setText('');
            }
        } catch (err) {
            console.error('Submit comment error:', err);
            setErrorMsg(err.message || 'Failed to post comment.');
        } finally {
            setPosting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    };

    const handleReplyKeyDown = (e, parentId) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(parentId); }
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

    const handleEditSave = async (commentId) => {
        if (!editText.trim() || posting) return;
        setPosting(true);
        setErrorMsg(null);
        try {
            await updateComment(token, commentId, editText.trim());
            setComments(prev => prev.map(c =>
                c.id === commentId ? { ...c, content: editText.trim() } : c
            ));
            setEditingId(null);
            setEditText('');
        } catch (err) {
            console.error('Edit comment error:', err);
            setErrorMsg(err.message || 'Failed to update comment.');
        } finally {
            setPosting(false);
        }
    };

    const activeCount = comments.filter(c => c.status === 'ACTIVE').length;
    const hiddenCount = comments.filter(c => c.status === 'HIDDEN').length;

    const topLevelComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId).reverse();

    const renderComment = (comment, isReply = false) => {
        const isHidden = comment.status === 'HIDDEN';
        const isAuthor = dbUser?.id === comment.user_id;
        const canDelete = isOwner || isAuthor;
        const canEdit = isAuthor;
        const canHide = isOwner && !isHidden;
        const canRestore = isOwner && isHidden;
        const replies = isReply ? [] : getReplies(comment.id);

        return (
            <div key={comment.id} style={{ marginLeft: isReply ? '40px' : '0', borderLeft: isReply ? '2px solid rgba(255,255,255,0.05)' : 'none', paddingLeft: isReply ? '16px' : '0' }}>
                <div className={`comment-item ${isHidden ? 'comment-item--hidden' : ''}`} style={{ marginBottom: isReply ? '8px' : '16px' }}>
                    {/* Hidden notice banner — only startup owner sees this */}
                    {isHidden && isOwner && (
                        <div className="comment-hidden-banner">
                            🚫 Hidden from public — only you can see this
                        </div>
                    )}

                    {/* Header */}
                    <div className="comment-header">
                        {comment.author?.photo_url ? (
                            <img
                                className="comment-avatar"
                                src={comment.author.photo_url}
                                alt={authorLabel(comment.author)}
                                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <div className="comment-avatar-small comment-avatar-fallback" style={{ width: '24px', height: '24px', fontSize: '0.7rem', display: comment.author?.photo_url ? 'none' : 'flex' }}>
                            {authorLabel(comment.author)[0].toUpperCase()}
                        </div>
                        <span className="comment-author-name">{authorLabel(comment.author)}</span>
                        <span className="comment-date">{timeAgo(comment.created_at || comment.createdAt)}</span>
                    </div>

                    {/* Text / Edit Mode */}
                    {editingId === comment.id ? (
                        <div className="comment-edit-form" style={{ marginTop: '8px', marginBottom: '12px' }}>
                            <textarea
                                className="comment-input"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                rows={2}
                                autoFocus
                                style={{
                                    fontSize: '0.9rem', padding: '10px 14px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.9)', width: '100%'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => { setEditingId(null); setEditText(''); }}
                                    disabled={posting}
                                    style={{
                                        padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600,
                                        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer', borderRadius: '100px', transition: 'color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'white'}
                                    onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleEditSave(comment.id)}
                                    disabled={!editText.trim() || posting}
                                    style={{
                                        padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600,
                                        background: (!editText.trim() || posting) ? 'rgba(14, 165, 233, 0.4)' : '#0ea5e9',
                                        border: 'none', color: 'white', cursor: (!editText.trim() || posting) ? 'not-allowed' : 'pointer',
                                        borderRadius: '100px', transition: 'background 0.2s'
                                    }}
                                >
                                    {posting ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="comment-text">{comment.content}</p>
                    )}

                    {/* Actions row: votes left, owner controls right */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <CommentVoteBar
                                comment={comment}
                                dbUser={dbUser}
                                token={token}
                            />
                            {dbUser && !isHidden && !isReply && (
                                <button
                                    className="comment-reply-btn"
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    style={{
                                        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
                                        fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '4px 8px', borderRadius: '4px', transition: 'all 0.2s'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 10 20 15 15 20"></polyline>
                                        <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                                    </svg>
                                    Reply
                                </button>
                            )}
                        </div>

                        {(canHide || canRestore || canDelete || canEdit) && (
                            <div className="comment-actions comment-owner-actions" style={{ marginTop: 0 }}>
                                {canEdit && !isHidden && (
                                    <button
                                        className="comment-restore-btn"
                                        onClick={() => { setEditingId(comment.id); setEditText(comment.content); }}
                                        title="Edit your comment"
                                        style={{ color: '#0ea5e9', background: 'transparent', border: 'none', padding: 0 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                )}
                                {canRestore && (
                                    <button
                                        className="comment-restore-btn"
                                        onClick={() => handleRestore(comment.id)}
                                        title="Make this comment visible again"
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                            <polyline points="9 14 4 9 9 4"></polyline>
                                            <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
                                        </svg>
                                    </button>
                                )}
                                {canHide && (
                                    <button
                                        className="comment-hide-btn"
                                        onClick={() => handleHide(comment.id)}
                                        title="Hide this comment from public"
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    </button>
                                )}
                                {canDelete && (
                                    <button
                                        className="comment-delete-btn"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Permanently delete"
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                    <div className="comment-input-row" style={{ marginLeft: '40px', marginBottom: '20px', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="comment-input-avatar-container">
                            {dbUser?.photo_url ? (
                                <img src={dbUser.photo_url} className="comment-avatar-small" alt="My Profile" style={{ width: 24, height: 24 }} />
                            ) : (
                                <div className="comment-avatar-small comment-avatar-fallback" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                    {(dbUser?.name || dbUser?.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <textarea
                            className="comment-input"
                            placeholder="Write a reply…"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={(e) => handleReplyKeyDown(e, comment.id)}
                            rows={1}
                            style={{ fontSize: '0.9rem', padding: '8px' }}
                            autoFocus
                        />
                        <button
                            className="comment-submit-btn"
                            onClick={() => handleSubmit(comment.id)}
                            disabled={!replyText.trim() || posting}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                            {posting ? '…' : 'Reply'}
                        </button>
                    </div>
                )}

                {/* Render Replies */}
                {replies.length > 0 && (
                    <div className="comment-replies">
                        {replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="comments-section">
            <div className="comments-body">
                {errorMsg && (
                    <div style={{ padding: '10px 14px', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.15)', borderLeft: '4px solid #ef4444', borderRadius: '4px', color: '#fca5a5', fontSize: '0.9rem' }}>
                        {errorMsg}
                    </div>
                )}
                {/* Input */}
                {dbUser ? (
                    <div className="comment-input-row">
                        <div className="comment-input-avatar-container">
                            {dbUser.photo_url ? (
                                <img src={dbUser.photo_url} className="comment-avatar-small" alt="My Profile" />
                            ) : (
                                <div className="comment-avatar-small comment-avatar-fallback">
                                    {(dbUser.name || dbUser.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
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
                ) : topLevelComments.length === 0 ? (
                    <p className="comments-empty">No comments yet. Be the first!</p>
                ) : (
                    <div className="comment-list">
                        {topLevelComments.map(comment => renderComment(comment))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
