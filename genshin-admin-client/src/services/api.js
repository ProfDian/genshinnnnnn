// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup token pada interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    // Login dilakukan melalui Firebase, tidak melalui API ini
    // Fungsi ini dibiarkan untuk kemungkinan integrasi di masa depan
    return { message: "Login dilakukan melalui Firebase" };
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/user");
    return response.data;
  },
};

// Character API
export const characterAPI = {
  getAllCharacters: async () => {
    const response = await api.get("/characters");
    return response.data;
  },

  getCharacterById: async (id) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  createCharacter: async (data) => {
    const formData = new FormData();

    // Tambahkan data text ke FormData
    Object.keys(data).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, data[key]);
      }
    });

    // Tambahkan file jika ada
    if (data.icon) formData.append("icon", data.icon);
    if (data.gachaImg) formData.append("gachaImg", data.gachaImg);

    const response = await api.post("/characters", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  updateCharacter: async (id, data) => {
    const formData = new FormData();

    // Tambahkan data text ke FormData
    Object.keys(data).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, data[key]);
      }
    });

    // Tambahkan file jika ada
    if (data.icon) formData.append("icon", data.icon);
    if (data.gachaImg) formData.append("gachaImg", data.gachaImg);

    const response = await api.put(`/characters/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  deleteCharacter: async (id) => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
};

// Character Stats API
export const characterStatsAPI = {
  getCharacterStats: async (characterId) => {
    const response = await api.get(`/stats/character/${characterId}`);
    return response.data;
  },

  getStatTypes: async () => {
    const response = await api.get("/stats/types");
    return response.data;
  },

  getLevelAscensionMap: async () => {
    const response = await api.get("/stats/levels");
    return response.data;
  },

  addCharacterStats: async (characterId, data) => {
    const response = await api.post(`/stats/character/${characterId}`, data);
    return response.data;
  },

  updateCharacterStat: async (statId, data) => {
    const response = await api.put(`/stats/${statId}`, data);
    return response.data;
  },

  previewCharacterStats: async (data) => {
    const response = await api.post("/stats/preview", data);
    return response.data;
  },
};

export default api;
