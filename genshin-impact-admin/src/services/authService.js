import api from "./api";
import { jwtDecode } from "jwt-decode";

const authService = {
  // Login user
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    const { token, user } = response.data;

    // Cek apakah user adalah admin
    if (!user.isAdmin) {
      throw new Error("Akses ditolak. Anda bukan admin.");
    }

    // Simpan token dan data user di localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Cek apakah user sudah login
  isAuthenticated: () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {
      // Decode token dan cek expiry
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token sudah expired
        authService.logout();
        return false;
      }

      return true;
    } catch (error) {
      // Token invalid
      authService.logout();
      return false;
    }
  },

  // Mendapatkan data user current
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get user profile details from API
  getUserProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },
};

export default authService;
