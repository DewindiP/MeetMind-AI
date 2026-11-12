
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach the saved JWT to protected API requests.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("meetmind_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Keep API error handling consistent.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("meetmind_token");
      localStorage.removeItem("meetmind_user");
    }

    return Promise.reject(error);
  },
);

export default api;
