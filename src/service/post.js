import { API_URL } from './api';

/**
 * Creates a new startup post (Update/Milestone/Gallery)
 * @param {string} token - Firebase ID token
 * @param {FormData} formData - Contains title, content, startup_id, and media files
 */
export const createPost = async (token, formData) => {
    const res = await fetch(`${API_URL}/posts/add`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
};

/**
 * Fetches all approved posts for a specific startup
 * @param {string} startupId 
 */
export const getStartupPosts = async (startupId) => {
    const res = await fetch(`${API_URL}/posts/startup/${startupId}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
};

/**
 * Fetches all approved posts from all startups (Global Feed)
 * @param {string} token - Optional token to personalize feed (e.g. exclude own posts)
 */
export const getAllPosts = async (token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/posts`, {
        headers
    });
    if (!res.ok) throw new Error('Failed to fetch global post feed');
    return res.json();
};

/**
 * Updates an existing startup post (supports multiple new media uploads).
 *
 * @param {string} token   - Firebase ID token
 * @param {string} postId  - ID of the post to update
 * @param {FormData} formData - Fields:
 *   - title, content, post_type, media_type, demo_link, external_link, comments_enabled (text)
 *   - keep_media  — JSON.stringify([...existingS3Keys])  (which old media to preserve)
 *   - media       — one or more new File objects to upload
 *   - thumbnail   — optional new thumbnail File
 */
export const updatePost = async (token, postId, formData) => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to update post');
    }
    return res.json();
};

/**
 * Deletes a startup post by ID.
 * @param {string} token  - Firebase ID token
 * @param {string} postId - ID of the post to delete
 */
export const deletePost = async (token, postId) => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to delete post');
    }
    return res.json();
};
