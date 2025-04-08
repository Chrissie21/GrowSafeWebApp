import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/auth/", // Adjust based on your Django server URL
});

export default api;
