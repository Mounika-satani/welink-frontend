import { API_URL } from './api';

/**
 * GET /api/auth/profile/:firebase_uid
 * Protected — requires Firebase token.
 * Returns user profile with signed S3 photo_url (24h valid).
 *
 * @param {string} firebaseUid - The Firebase UID of the user
 * @param {string} token       - Firebase ID token
 * @returns {Promise<object>} - User profile object
 */
export const getUserProfile = async (firebaseUid, token) => {
    const res = await fetch(`${API_URL}/auth/profile/${firebaseUid}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to fetch profile');
    }

    return res.json(); // { id, firebase_uid, email, photo_url, role, is_active, ... }
};

/**
 * PUT /api/auth/profile/:firebase_uid
 * Protected — requires Firebase token.
 * Supports photo upload via multipart/form-data.
 *
 * @param {string} firebaseUid  - The Firebase UID of the user
 * @param {string} token        - Firebase ID token
 * @param {object} updates      - { is_active?, photoURL? }
 * @param {File}   [photoFile]  - Optional image file to upload
 * @returns {Promise<object>}   - Updated user profile
 */
export const updateUserProfile = async (firebaseUid, token, updates = {}, photoFile = null) => {
    const formData = new FormData();

    if (photoFile) {
        formData.append('photo', photoFile);
    }

    Object.entries(updates).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
            formData.append(key, val);
        }
    });

    const res = await fetch(`${API_URL}/auth/profile/${firebaseUid}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            // Do NOT set Content-Type — browser sets it automatically with boundary for multipart
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to update profile');
    }

    return res.json();
};

/**
 * DELETE /api/auth/profile/:firebase_uid/photo
 * Removes the user's profile picture (sets photo_url to null).
 */
export const deleteUserProfilePhoto = async (firebaseUid, token) => {
    const res = await fetch(`${API_URL}/auth/profile/${firebaseUid}/photo`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to remove photo');
    }
    return res.json();
};
