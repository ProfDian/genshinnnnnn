// src/services/authService.js
import api from "./api";

// authService.js
export const login = async ({ username, password }) => {
  const response = await api.post("/auth/login", { username, password });
  const { token, user } = response.data;

  // Simpan token
  localStorage.setItem("token", token);

  // Simpan flag isAdmin jika perlu
  localStorage.setItem("isAdmin", user.isAdmin || false);

  return user;
};

export const register = async (userData) => {
  const formData = new FormData();

  // Add all user data to formData
  Object.keys(userData).forEach((key) => {
    if (key === "profileImage" && userData[key] instanceof File) {
      formData.append("profileImage", userData[key]);
    } else {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const { token, user } = response.data;
  localStorage.setItem("token", token);

  return user;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data.user;
  } catch (error) {
    logout();
    throw error;
  }
};

export const updateProfile = async (userData) => {
  const formData = new FormData();

  // Add all user data to formData
  Object.keys(userData).forEach((key) => {
    if (key === "profileImage" && userData[key] instanceof File) {
      formData.append("profileImage", userData[key]);
    } else if (userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.user;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  await api.put("/auth/change-password", { currentPassword, newPassword });
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};
