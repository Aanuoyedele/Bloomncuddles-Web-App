const API_BASE = 'http://localhost:4000/api';

// Session expired event - components can listen to this
export const SESSION_EXPIRED_EVENT = 'session-expired';

function handleSessionExpired() {
    // Clear stored credentials
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch custom event for any listeners
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));

    // Determine redirect based on current path
    const currentPath = window.location.pathname;
    let loginUrl = '/login';

    if (currentPath.startsWith('/parent')) {
        loginUrl = '/parent/login';
    } else if (currentPath.startsWith('/dashboard')) {
        loginUrl = '/login';
    }

    // Redirect with session expired message
    window.location.href = `${loginUrl}?expired=true`;
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Request failed' }));

        // Check for token-related errors (401 Unauthorized or specific messages)
        if (res.status === 401 ||
            error.message?.toLowerCase().includes('invalid token') ||
            error.message?.toLowerCase().includes('token expired') ||
            error.message?.toLowerCase().includes('jwt expired') ||
            error.message?.toLowerCase().includes('unauthorized')) {

            // Only handle session expiry if we had a token (was logged in)
            if (token && typeof window !== 'undefined') {
                handleSessionExpired();
                throw new Error('Session expired. Please login again.');
            }
        }

        throw new Error(error.message || 'Something went wrong');
    }

    return res.json();
}

// Convenience methods
export const api = {
    get: (endpoint: string) => fetchAPI(endpoint),
    post: (endpoint: string, data: any) => fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint: string, data: any) => fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint: string, data: any) => fetchAPI(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint: string) => fetchAPI(endpoint, { method: 'DELETE' }),
};
