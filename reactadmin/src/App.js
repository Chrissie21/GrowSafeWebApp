import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components /Sidebar";
import Login from "./components /Login";
import AdminPanel from "./components /AdminPanel";

const apiBaseUrl = "http://localhost:8000/api/auth/";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const response = await axios.post(`${apiBaseUrl}token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/#login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState(null);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setUser({ is_admin: true });
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("logout/", { refresh: refreshToken });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      setLogoutError("");
      window.location.href = "/#login";
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Failed to logout. Please try again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = "/#login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {logoutError && (
        <div className="absolute top-0 w-full bg-red-500 text-white p-2 text-center">
          {logoutError}
        </div>
      )}
      {isAuthenticated ? (
        <div className="flex h-screen">
          <Sidebar handleLogout={handleLogout} />
          <div className="flex-1 p-6 overflow-auto">
            {user && <AdminPanel />}
          </div>
        </div>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default App;
