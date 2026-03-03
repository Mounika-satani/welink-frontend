import { API_URL } from './api';

/**
 * POST /api/auth/login
 *
 * Sends the Firebase ID token to the backend.
 * The backend will:
 *  - Decode the token (uid, email, picture, sign_in_provider)
 *  - Create or find the user in the DB
 *  - Upload the Google profile picture to S3 (if not already there)
 *  - Return the user object with a signed S3 photo URL (valid 24h)
 *
 * @param {string} token - Firebase ID token from currentUser.getIdToken()
 * @returns {Promise<{ message: string, user: object }>}
 */
export const loginUser = async (token) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Login failed');
    }

    return res.json();
};
