import { API_URL } from './api';

/**
 * Fetch all active comments for a post (with vote counts)
 */
export const getComments = async (post_id, user_id = null) => {
    const url = `${API_URL}/comments/${post_id}${user_id ? `?user_id=${user_id}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
};

/**
 * Post a new text comment on a post
 */
export const addComment = async (token, post_id, content, parent_id = null) => {
    const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id, content, parent_id }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to add comment');
    }
    return res.json();
};

/**
 * Upvote or downvote a comment (toggle — same vote removes it)
 */
export const voteComment = async (token, comment_id, vote_type) => {
    const res = await fetch(`${API_URL}/comments/${comment_id}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vote_type }),
    });
    if (!res.ok) throw new Error('Failed to cast vote');
    return res.json();
};

/**
 * Delete a comment (author or startup owner)
 */
export const deleteComment = async (token, comment_id) => {
    const res = await fetch(`${API_URL}/comments/${comment_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
};

/**
 * Startup owner hides a comment (soft-hide)
 */
export const hideComment = async (token, comment_id) => {
    const res = await fetch(`${API_URL}/comments/${comment_id}/hide`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to hide comment');
    return res.json();
};

/**
 * Startup owner — fetch ALL comments (including HIDDEN) for their post
 */
export const getAllComments = async (token, post_id) => {
    const res = await fetch(`${API_URL}/comments/${post_id}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch all comments');
    return res.json();
};

/**
 * Startup owner restores a hidden comment back to ACTIVE
 */
export const restoreComment = async (token, comment_id) => {
    const res = await fetch(`${API_URL}/comments/${comment_id}/restore`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to restore comment');
    return res.json();
};

/**
 * Edit an existing comment
 */
export const updateComment = async (token, comment_id, content) => {
    const res = await fetch(`${API_URL}/comments/${comment_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to update comment');
    }
    return res.json();
};
