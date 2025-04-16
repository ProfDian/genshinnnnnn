import api from "./api";

// Service untuk mengakses character stats API
const characterStatService = {
  // Get all stats for a character
  getCharacterStats: async (characterId) => {
    try {
      const response = await api.get(`/stats/character/${characterId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character stats:", error);
      throw error;
    }
  },

  // Get all available stat types
  getStatTypes: async () => {
    try {
      const response = await api.get("/stats/types");
      return response.data;
    } catch (error) {
      console.error("Error fetching stat types:", error);
      throw error;
    }
  },

  // Get level to ascension mapping data
  getLevelAscensionMap: async () => {
    try {
      const response = await api.get("/stats/levels");
      return response.data;
    } catch (error) {
      console.error("Error fetching level ascension map:", error);
      throw error;
    }
  },

  // Get base stat values
  getBaseStatValues: async () => {
    try {
      const response = await api.get("/stats/base-values");
      return response.data;
    } catch (error) {
      console.error("Error fetching base stat values:", error);
      throw error;
    }
  },

  // Add stats to a character based on level 1 and max ascension values
  addCharacterStats: async (characterId, statsData) => {
    try {
      const response = await api.post(
        `/stats/character/${characterId}`,
        statsData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding character stats:", error);
      throw error;
    }
  },

  // Update a specific character stat
  updateCharacterStat: async (statId, statData) => {
    try {
      const response = await api.put(`/stats/${statId}`, statData);
      return response.data;
    } catch (error) {
      console.error("Error updating character stat:", error);
      throw error;
    }
  },

  // Generate preview stats without saving to database
  previewCharacterStats: async (previewData) => {
    try {
      const response = await api.post("/stats/preview", previewData);
      return response.data;
    } catch (error) {
      console.error("Error previewing character stats:", error);
      throw error;
    }
  },
};

export default characterStatService;
