import axios from 'axios';

import { extractMessage, isSilent } from '../utils/errorMessages';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://blindidea.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap { success, data } and handle 401 + refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Unwrap standardized API responses: if response.data has { success, data },
    // replace response.data with the inner data for backward compat
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success && response.data.data !== undefined) {
        response.data = response.data.data;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Auth endpoints are expected to return 401 for wrong credentials —
    // do NOT attempt token refresh or redirect for these.
    const AUTH_ENDPOINTS = [
      '/Auth/login',
      '/Auth/register',
      '/Auth/verify-email',
      '/Auth/forgot-password',
      '/Auth/verify-reset',
      '/Auth/change-password',
      '/Auth/Verify-email',
    ];
    const requestUrl = (originalRequest?.url || '').toLowerCase();
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) =>
      requestUrl.toLowerCase().includes(ep.toLowerCase())
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'https://blindidea.duckdns.org/api'}/Auth/refresh-token`,
          { refreshToken }
        );

        // Handle both wrapped and unwrapped responses
        const responseData = response.data?.data ?? response.data;
        const { accessToken, refreshToken: newRefreshToken } = responseData;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Global error toast (unless the error is a "silent" expected state) ──
    const message = extractMessage(error);

    // Log all errors to the console for debugging
    console.error('[API Error]', {
      status: error.response?.status,
      message,
      url: error.config?.url,
    });

    // Only toast if the error is NOT a known silent pattern
    // AND the caller hasn't opted out by setting _skipGlobalToast
    if (!isSilent(message) && !originalRequest?._skipGlobalToast) {
      // Don't toast here — let individual hooks handle it for context-specific messages.
      // The interceptor only toasts for truly unhandled errors (no onError in the caller).
      // We mark the error so hooks can check if they want to suppress the global toast.
      error._extractedMessage = message;
    }

    return Promise.reject(error);
  }
);

export default api;
