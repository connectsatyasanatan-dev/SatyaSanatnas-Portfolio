import axios from 'axios';

// Get base URL from env, or default to localhost
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Global Axios Client for portfolio requests
 * Automatically handles base URL, timeout, and authorization token if it exists.
 */
const apiClient = axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token if required
apiClient.interceptors.request.use(
    (config) => {
        // Only attach token for admin routes to save overhead
        if (typeof window !== 'undefined' && config.url?.includes('/admin')) {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // You could theoretically handle global 401 logouts here
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            // uncomment the line below if you want to redirect automatically on 401
            // window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
