import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // required to send HTTP-only refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// We will inject the access token dynamically via a function since it lives in memory.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Add interceptor to inject access token
apiClient.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor for 401s to attempt silent refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/signup')
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true, // Send refresh cookie
        });

        if (data.success && data.data.accessToken) {
          setAccessToken(data.data.accessToken);
          // Update original request header
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        // Force redirect to login if refresh fails and we are not already on login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
