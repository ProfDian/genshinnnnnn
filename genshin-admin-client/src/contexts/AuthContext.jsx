// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
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
  async function login(email, password) {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      // Simpan token ke localStorage
      localStorage.setItem("authToken", token);

      // Set axios default header untuk semua request
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Ambil informasi user dari backend
      try {
        const response = await axios.get(`${API_URL}/auth/user`);
        setUserInfo(response.data.user);
      } catch (backendError) {
        console.error("Error getting user info from backend:", backendError);
      }

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Fungsi untuk logout
  async function logout() {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      setUserInfo(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Fungsi untuk register (jika diperlukan)
  async function register(email, password, username) {
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });

      // Daftarkan user ke backend
      const token = await userCredential.user.getIdToken();

      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.post(`${API_URL}/auth/register`, {
        firebaseUid: userCredential.user.uid,
        email,
        username,
      });

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Fungsi untuk refresh token
  async function refreshToken() {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("authToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return token;
      } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
      }
    }
    return null;
  }

  // Effect untuk memantau status autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Dapatkan token dan set ke axios header
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Dapatkan informasi user dari backend
        try {
          const response = await axios.get(`${API_URL}/auth/user`);
          setUserInfo(response.data.user);
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      } else {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        setUserInfo(null);
      }

      setLoading(false);
    });

    // Setup axios interceptor untuk refresh token jika 401
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshToken();
            return axios(originalRequest);
          } catch (refreshError) {
            // Force logout pada error refresh token
            await logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      unsubscribe();
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    currentUser,
    userInfo,
    login,
    logout,
    register,
    refreshToken,
    error,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
