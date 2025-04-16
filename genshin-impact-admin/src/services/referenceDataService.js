import api from "./api";

// Service untuk mengakses reference data API (elements, weapon types, rarities, dll)
const referenceDataService = {
  // Get all elements
  getAllElements: async () => {
    try {
      const response = await api.get("/reference/elements");
      return response.data;
    } catch (error) {
      console.error("Error fetching elements:", error);
      throw error;
    }
  },

  // Get all weapon types
  getAllWeaponTypes: async () => {
    try {
      const response = await api.get("/reference/weapon-types");
      return response.data;
    } catch (error) {
      console.error("Error fetching weapon types:", error);
      throw error;
    }
  },

  // Get all rarities
  getAllRarities: async () => {
    try {
      const response = await api.get("/reference/rarities");
      return response.data;
    } catch (error) {
      console.error("Error fetching rarities:", error);
      throw error;
    }
  },

  // Get filtered characters
  getFilteredCharacters: async (filters = {}) => {
    try {
      // Convert filters object to query params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const response = await api.get(
        `/reference/characters/filter?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered characters:", error);
      throw error;
    }
  },

  // Get filtered weapons
  getFilteredWeapons: async (filters = {}) => {
    try {
      // Convert filters object to query params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const response = await api.get(
        `/reference/weapons/filter?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered weapons:", error);
      throw error;
    }
  },
};

export default referenceDataService;
