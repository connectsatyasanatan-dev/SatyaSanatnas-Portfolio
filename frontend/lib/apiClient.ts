import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 12000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT for admin routes ────────
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined' && config.url?.includes('/admin')) {
            const token = localStorage.getItem('admin_token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 globally ───────────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retryCount?: number };

        // Auto-logout on 401 for admin routes
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            if (config.url?.includes('/admin')) {
                localStorage.removeItem('admin_token');
            }
        }

        // Retry on network errors or 5xx (max 2 retries, non-admin only)
        const isAdminRoute = config.url?.includes('/admin');
        const shouldRetry =
            !isAdminRoute &&
            (config._retryCount ?? 0) < 2 &&
            (!error.response || error.response.status >= 500);

        if (shouldRetry) {
            config._retryCount = (config._retryCount ?? 0) + 1;
            const delay = config._retryCount * 800; // 800ms, 1600ms
            await new Promise((r) => setTimeout(r, delay));
            return apiClient(config);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
