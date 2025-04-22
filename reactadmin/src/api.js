import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/auth/',
});

// REQUEST INTERCEPTOR – Attach access token
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR – Refresh token on 401
api.interceptors.response.use(
  (response) => response, // If the response is fine, just return it
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried refreshing
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        console.warn('No refresh token available.');
        return Promise.reject(error);
      }

      try {
        // Try to get a new access token
        const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;

        // Save the new token
        localStorage.setItem('access_token', newAccessToken);

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest); // retry original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
