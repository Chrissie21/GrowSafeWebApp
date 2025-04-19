import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components /Sidebar";
import Login from "./components /Login";
import AdminPanel from "./components /AdminPanel";

const apiBaseUrl = "http://localhost:8000/api/auth/";

// Axios instance with JWT interceptor
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUser({ is_admin: true }); // Assume admin for simplicity
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await api.post("logout/", {
        refresh: localStorage.getItem("refreshToken"),
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar handleLogout={handleLogout} />
      <div className="flex-1 p-6 overflow-auto">{user && <AdminPanel />}</div>
    </div>
  );
}

export default App;
