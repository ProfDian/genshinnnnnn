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
};

export default weaponService;
