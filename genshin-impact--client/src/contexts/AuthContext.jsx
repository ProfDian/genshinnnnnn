// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { login, logout, getCurrentUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid token
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Login function
  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const userData = await login(credentials);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register function handled in authService directly

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
