import { API_URL } from './api';


export const getCategories = async () => {
    const res = await fetch(`${API_URL}/categories/all`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export const getAllStartups = async (page = 1, limit = 10, category = 'All', search = '') => {
    const res = await fetch(`${API_URL}/startups/all?page=${page}&limit=${limit}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`);
    if (!res.ok) throw new Error('Failed to fetch startups');
    return res.json();
};

/**
 * POST /api/startups/create — requires Firebase token
 * Sends multipart/form-data so logo file can be uploaded to S3.
 *
 * @param {string} token     - Firebase ID token
 * @param {object} data      - { name, tagline, description, industry_id, website_url, funding_stage, location, team_size }
 * @param {File|null} logoFile - Optional logo image file
 * @returns {Promise<object>} - Created startup { id, name, logo_url, ... }
 */
export const createStartup = async (token, data, logoFile = null) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
            formData.append(key, val);
        }
    });

    if (logoFile) {
        formData.append('logo', logoFile);
    }

    const res = await fetch(`${API_URL}/startups/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to create startup');
    }
    return res.json();
};

/**
 * POST /api/founders/add
 * Sends multipart/form-data so founder photo can be uploaded to S3.
 *
 * @param {object} data     - { startup_id, name, role, linkedin_url }
 * @param {File|null} photoFile - Optional founder photo file
 * @returns {Promise<object>} - Created founder
 */
export const addFounder = async (data, photoFile = null) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
            formData.append(key, val);
        }
    });

    if (photoFile) {
        formData.append('photo', photoFile);
    }

    const res = await fetch(`${API_URL}/founders/add`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to add founder');
    }
    return res.json();
};


export const getMyStartup = async (token) => {
    const res = await fetch(`${API_URL}/startups/my-startup`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to fetch your startup');
    }
    return res.json();
};


export const getTrendingStartups = async (limit = 8) => {
    const res = await fetch(`${API_URL}/startups/trending?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch trending startups');
    return res.json();
};

export const updateStartup = async (token, startupId, data, logoFile = null, certFile = null, bannerFile = null) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
            fd.append(k, v);
        }
    });
    if (logoFile) fd.append('logo', logoFile);
    if (certFile) fd.append('incorporation_certificate', certFile);
    if (bannerFile) fd.append('banner', bannerFile);

    const res = await fetch(`${API_URL}/startups/${startupId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to update startup');
    }
    return res.json();
};


export const deleteStartup = async (token, startupId) => {
    const res = await fetch(`${API_URL}/startups/${startupId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Failed to delete startup');
    }
    return res.json();
};
