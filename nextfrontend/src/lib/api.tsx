import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/auth/", // Django API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage or sessionStorage")
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) =>  response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try{
        // Check both localStorage and sessionStorage for refresh_token
        const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem('refresh_token');
        if (!refreshToken){
          throw new Error("No refresh token available")
        }
        const response = await axios.post(
          "http://localhost:8000/api/auth/refresh/",
          {
            refreshToken,
          }
        );
        const { access } = response.data;
        // Store new access token in the same storage as the refreshToken
        if (localStorage.getItem("refresh_token")) {
          localStorage.setItem("access_token", access);
        } else if(sessionStorage.setItem("refresh_token")){
          localStorage.setItem("access_token", access);
        }
        originalRequest.headers.Authorization = 'Bearer ${access}';
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear both storages and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
