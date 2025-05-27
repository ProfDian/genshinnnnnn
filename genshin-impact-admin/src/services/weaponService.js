import api from "./api";

// Service untuk mengakses weapon API
const weaponService = {
  // Get all weapons with optional filtering
  getAllWeapons: async (params = {}) => {
    try {
      const response = await api.get("/weapons", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching weapons:", error);
      throw error;
    }
  },

  // Get weapon by ID with full details
  getWeaponById: async (id) => {
    try {
      const response = await api.get(`/weapons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching weapon with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new weapon (admin only)
  createWeapon: async (weaponData) => {
    // Handling FormData if there are file uploads
    const isFormData = weaponData instanceof FormData;

    try {
      const response = await api.post("/weapons", weaponData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
    } catch (error) {
      console.error("Error creating weapon:", error);
      throw error;
    }
  },

  // Update weapon (admin only)
  updateWeapon: async (id, weaponData) => {
    // Handling FormData if there are file uploads
    const isFormData = weaponData instanceof FormData;

    try {
      const response = await api.put(`/weapons/${id}`, weaponData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating weapon with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete weapon (admin only)
  deleteWeapon: async (id, permanent = false) => {
    try {
      const response = await api.delete(`/weapons/${id}`, {
        params: { permanent },
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting weapon with ID ${id}:`, error);
      throw error;
    }
  },

  // ----- WEAPON PASSIVES -----

  // Get weapon passives
  getWeaponPassives: async (weaponId) => {
    try {
      const response = await api.get(`/weapons/${weaponId}/passives`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching passives for weapon ID ${weaponId}:`,
        error
      );
      throw error;
    }
  },

  // Create weapon passive
  createWeaponPassive: async (weaponId, passiveData) => {
    try {
      const response = await api.post(
        `/weapons/${weaponId}/passives`,
        passiveData
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating passive for weapon ID ${weaponId}:`, error);
      throw error;
    }
  },

  // Update weapon passive
  updateWeaponPassive: async (passiveId, passiveData) => {
    try {
      const response = await api.put(
        `/weapons/passives/${passiveId}`,
        passiveData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating passive with ID ${passiveId}:`, error);
      throw error;
    }
  },

  // Delete weapon passive
  deleteWeaponPassive: async (passiveId) => {
    try {
      const response = await api.delete(`/weapons/passives/${passiveId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting passive with ID ${passiveId}:`, error);
      throw error;
    }
  },

  // ----- WEAPON REFINEMENTS -----

  // Get weapon refinements
  getWeaponRefinements: async (weaponId) => {
    try {
      const response = await api.get(`/weapons/${weaponId}/refinements`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching refinements for weapon ID ${weaponId}:`,
        error
      );
      throw error;
    }
  },

  // Create weapon refinement
  createWeaponRefinement: async (weaponId, refinementData) => {
    try {
      const response = await api.post(
        `/weapons/${weaponId}/refinements`,
        refinementData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error creating refinement for weapon ID ${weaponId}:`,
        error
      );
      throw error;
    }
  },

  // Update weapon refinement
  updateWeaponRefinement: async (refinementId, refinementData) => {
    try {
      const response = await api.put(
        `/weapons/refinements/${refinementId}`,
        refinementData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating refinement with ID ${refinementId}:`,
        error
      );
      throw error;
    }
  },

  // Delete weapon refinement
  deleteWeaponRefinement: async (refinementId) => {
    try {
      const response = await api.delete(`/weapons/refinements/${refinementId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting refinement with ID ${refinementId}:`,
        error
      );
      throw error;
    }
  },

  // ----- WEAPON STATS -----

  // Get weapon stats
  getWeaponStats: async (weaponId) => {
    try {
      const response = await api.get(`/weapon-stats/weapon/${weaponId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for weapon ID ${weaponId}:`, error);
      throw error;
    }
  },

  // Add weapon stats
  addWeaponStats: async (weaponId, statsData) => {
    try {
      const response = await api.post(
        `/weapon-stats/weapon/${weaponId}`,
        statsData
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding stats for weapon ID ${weaponId}:`, error);
      throw error;
    }
  },

  // Update weapon stat
  updateWeaponStat: async (statId, statData) => {
    try {
      const response = await api.put(`/weapon-stats/${statId}`, statData);
      return response.data;
    } catch (error) {
      console.error(`Error updating stat with ID ${statId}:`, error);
      throw error;
    }
  },

  // Preview weapon stats
  previewWeaponStats: async (statsData) => {
    try {
      const response = await api.post(`/weapon-stats/preview`, statsData);
      return response.data;
    } catch (error) {
      console.error(`Error previewing weapon stats:`, error);
      throw error;
    }
  },

  // Get weapon types for stats calculation
  getWeaponTypes: async () => {
    try {
      const response = await api.get(`/weapon-stats/types`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching weapon types:`, error);
      throw error;
    }
  },

  // Get weapon substat types
  getSubstatTypes: async () => {
    try {
      const response = await api.get(`/weapon-stats/subtypes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching substat types:`, error);
      throw error;
    }
  },
};

export default weaponService;
