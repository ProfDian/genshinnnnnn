import axios from "axios";
import { toast } from "react-toastify";

// API base URL dari backend
const API_URL = "http://localhost:3000/api";

// Instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk request - menambahkan token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response - handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || "Terjadi kesalahan pada server";

    // Jika error 401 Unauthorized, artinya token expired atau invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
