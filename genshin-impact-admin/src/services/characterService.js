import api from "./api";

const characterService = {
  // Get all characters with pagination, filtering, and sorting
  getCharacters: async (params = {}) => {
    const response = await api.get("/characters", { params });
    return response.data;
  },

  // Get a single character by ID
  getCharacterById: async (id) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  // Create a new character
  createCharacter: async (characterData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add character basic info
    Object.keys(characterData).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, characterData[key]);
      }
    });

    // Add files if they exist
    if (characterData.icon) {
      formData.append("icon", characterData.icon);
    }

    if (characterData.gachaImg) {
      formData.append("gachaImg", characterData.gachaImg);
    }

    const response = await api.post("/characters", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update a character
  updateCharacter: async (id, characterData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add character basic info
    Object.keys(characterData).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, characterData[key]);
      }
    });

    // Add files if they exist
    if (characterData.icon instanceof File) {
      formData.append("icon", characterData.icon);
    }

    if (characterData.gachaImg instanceof File) {
      formData.append("gachaImg", characterData.gachaImg);
    }

    const response = await api.put(`/characters/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Delete a character (soft delete by default)
  deleteCharacter: async (id, permanent = false) => {
    const response = await api.delete(`/characters/${id}`, {
      params: { permanent },
    });

    return response.data;
  },

  // Get character talents
  getCharacterTalents: async (characterId) => {
    const response = await api.get(`/skills/talents/${characterId}`);
    return response.data;
  },

  // Get character passives
  getCharacterPassives: async (characterId) => {
    const response = await api.get(`/skills/passives/${characterId}`);
    return response.data;
  },

  // Get character constellations
  getCharacterConstellations: async (characterId) => {
    const response = await api.get(`/skills/constellations/${characterId}`);
    return response.data;
  },

  // Add character talent
  addCharacterTalent: async (characterId, talentData) => {
    const response = await api.post(
      `/skills/talents/${characterId}`,
      talentData
    );
    return response.data;
  },

  // Add character passive
  addCharacterPassive: async (characterId, passiveData) => {
    const response = await api.post(
      `/skills/passives/${characterId}`,
      passiveData
    );
    return response.data;
  },

  // Add character constellation
  addCharacterConstellation: async (characterId, constellationData) => {
    // Use FormData for file uploads if constellationIcon is provided
    if (constellationData.constellationIcon instanceof File) {
      const formData = new FormData();

      Object.keys(constellationData).forEach((key) => {
        if (key !== "constellationIcon") {
          formData.append(key, constellationData[key]);
        }
      });

      formData.append("constellationIcon", constellationData.constellationIcon);

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
    } else {
      const response = await api.post(
        `/skills/constellations/${characterId}`,
        constellationData
      );
      return response.data;
    }
  },

  // Bulk add character skills (talents, passives, constellations)
  bulkAddCharacterSkills: async (characterId, skillsData) => {
    const response = await api.post(`/skills/bulk/${characterId}`, skillsData);
    return response.data;
  },

  // Get character stats
  getCharacterStats: async (characterId) => {
    const response = await api.get(`/stats/character/${characterId}`);
    return response.data;
  },

  // Add character stats
  addCharacterStats: async (characterId, statsData) => {
    const response = await api.post(
      `/stats/character/${characterId}`,
      statsData
    );
    return response.data;
  },

  // Get elements (for dropdown menus)
  getElements: async () => {
    const response = await api.get("/elements");
    return response.data;
  },

  // Get weapon types (for dropdown menus)
  getWeaponTypes: async () => {
    const response = await api.get("/weapon-types");
    return response.data;
  },

  // Get rarities (for dropdown menus)
  getRarities: async () => {
    const response = await api.get("/rarities");
    return response.data;
  },
};

export default characterService;
