export const API_URL = 'https://app.communedge.in/api';

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return response;
};
