// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Fungsi untuk login
  async function login(username, password) {
    try {
      setError("");

      // Login dengan API JWT baru
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      const { token, user } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem("authToken", token);

      // Set axios default header untuk semua request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user info
      setUserInfo(user);
      setCurrentUser(user);

      return user;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    }
  }

  // Fungsi untuk logout
  async function logout() {
    try {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      setUserInfo(null);
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Fungsi untuk register
  async function register(userData) {
    try {
      setError("");

      const formData = new FormData();

      // Tambahkan data ke FormData
      Object.keys(userData).forEach((key) => {
        if (key === "profileImage" && userData[key]) {
          formData.append(key, userData[key]);
        } else if (key !== "profileImage") {
          formData.append(key, userData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { token, user } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user info
      setUserInfo(user);
      setCurrentUser(user);

      return user;
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  }

  // Fungsi untuk mendapatkan data user saat ini
  async function getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUserInfo(response.data.user);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Effect untuk verifikasi token saat startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          // Verifikasi token dengan mendapatkan data user
          await getCurrentUser();
        } catch (error) {
          console.error("Auth token invalid:", error);
          localStorage.removeItem("authToken");
          delete axios.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Setup axios interceptor untuk handling 401 error
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired atau invalid, logout user
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    currentUser,
    userInfo,
    login,
    logout,
    register,
    getCurrentUser,
    error,
    loading,
    isAdmin: userInfo?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
