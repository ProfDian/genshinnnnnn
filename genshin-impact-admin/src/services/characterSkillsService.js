import api from "./api";

// Service untuk mengakses character skills API (talents, passives, constellations)
const characterSkillsService = {
  // Get all talents for a character
  getCharacterTalents: async (characterId) => {
    try {
      const response = await api.get(`/skills/talents/${characterId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character talents:", error);
      throw error;
    }
  },

  // Get all passives for a character
  getCharacterPassives: async (characterId) => {
    try {
      const response = await api.get(`/skills/passives/${characterId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character passives:", error);
      throw error;
    }
  },

  // Get all constellations for a character
  getCharacterConstellations: async (characterId) => {
    try {
      const response = await api.get(`/skills/constellations/${characterId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character constellations:", error);
      throw error;
    }
  },

  // Add a new talent to a character
  addCharacterTalent: async (characterId, talentData) => {
    try {
      const response = await api.post(
        `/skills/talents/${characterId}`,
        talentData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding character talent:", error);
      throw error;
    }
  },

  // Add a new passive to a character
  addCharacterPassive: async (characterId, passiveData) => {
    try {
      const response = await api.post(
        `/skills/passives/${characterId}`,
        passiveData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding character passive:", error);
      throw error;
    }
  },

  // Add a new constellation to a character
  addCharacterConstellation: async (characterId, constellationData) => {
    try {
      // Handle file upload for constellation icon
      const formData = new FormData();

      // Add all fields from constellationData to formData
      Object.keys(constellationData).forEach((key) => {
        if (
          key === "constellationIcon" &&
          constellationData[key] instanceof File
        ) {
          formData.append("constellationIcon", constellationData[key]);
        } else {
          formData.append(key, constellationData[key]);
        }
      });

      const response = await api.post(
        `/skills/constellations/${characterId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding character constellation:", error);
      throw error;
    }
  },

  // Bulk add all skills (talents, passives, constellations) to a character
  bulkAddCharacterSkills: async (characterId, skillsData) => {
    try {
      const response = await api.post(
        `/skills/bulk/${characterId}`,
        skillsData
      );
      return response.data;
    } catch (error) {
      console.error("Error bulk adding character skills:", error);
      throw error;
    }
  },
};

export default characterSkillsService;
