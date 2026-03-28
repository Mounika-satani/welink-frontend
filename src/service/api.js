// export const API_URL = 'http://3.236.250.43:8000/api';
export const API_URL = 'http://localhost:8000/api';

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return response;
};
