const API_BASE = 'http://localhost:4000/api';

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
