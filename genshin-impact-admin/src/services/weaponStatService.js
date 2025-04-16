import api from "./api";

// Service untuk mengakses weapon stats API dari frontend admin
const weaponStatService = {
  // Mendapatkan semua stats untuk weapon tertentu
  getWeaponStats: async (weaponId) => {
    try {
      const response = await api.get(`/weapon-stats/weapon/${weaponId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching weapon stats:", error);
      throw error;
    }
  },

  // Mendapatkan semua tipe weapon yang tersedia
  getWeaponTypes: async () => {
    try {
      const response = await api.get("/weapon-stats/types");
      return response.data;
    } catch (error) {
      console.error("Error fetching weapon types:", error);
      throw error;
    }
  },

  // Mendapatkan semua jenis substat yang tersedia
  getSubstatTypes: async () => {
    try {
      const response = await api.get("/weapon-stats/subtypes");
      return response.data;
    } catch (error) {
      console.error("Error fetching substat types:", error);
      throw error;
    }
  },

  // Menambahkan stats untuk weapon
  addWeaponStats: async (weaponId, statsData) => {
    try {
      const response = await api.post(
        `/weapon-stats/weapon/${weaponId}`,
        statsData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding weapon stats:", error);
      throw error;
    }
  },

  // Update specific weapon stat
  updateWeaponStat: async (statId, statData) => {
    try {
      const response = await api.put(`/weapon-stats/${statId}`, statData);
      return response.data;
    } catch (error) {
      console.error("Error updating weapon stat:", error);
      throw error;
    }
  },

  // Generate preview stats without saving to database
  previewWeaponStats: async (previewData) => {
    try {
      const response = await api.post("/weapon-stats/preview", previewData);
      return response.data;
    } catch (error) {
      console.error("Error previewing weapon stats:", error);
      throw error;
    }
  },
};

export default weaponStatService;
