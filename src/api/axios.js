import axios from "axios";

// If multiple VITE_API_URL are defined in .env, Vite usually takes the last one.
// This logic ensures we pick the right one for the right environment.
// const baseURL = "https://musifyx-backend.onrender.com/api";
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://musifyx-backend.onrender.com/api");

console.log(`🚀 API Base URL: ${baseURL}`);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
