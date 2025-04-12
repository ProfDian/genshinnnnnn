// src/services/characterService.js
import api from "./api";

const characterService = {
  // Get all characters with filtering, pagination
  getAllCharacters: (params = {}) => {
    console.log(params);
    return api.get("/characters", { params });
  },

  // Get character detail by ID
  getCharacterById: (id) => {
    return api.get(`/characters/${id}`);
  },

  // Get character stats
  getCharacterStats: (characterId) => {
    return api.get(`/stats/character/${characterId}`);
  },

  // Get character talents
  getCharacterTalents: (characterId) => {
    return api.get(`/skills/talents/${characterId}`);
  },

  // Get character passives
  getCharacterPassives: (characterId) => {
    return api.get(`/skills/passives/${characterId}`);
  },

  // Get character constellations
  getCharacterConstellations: (characterId) => {
    return api.get(`/skills/constellations/${characterId}`);
  },

  // Get elements
  getElements: () => {
    return api.get("/elements");
  },

  // Admin: Create character
  createCharacter: (characterData) => {
    const formData = new FormData();

    // Add character data to formData
    Object.keys(characterData).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, characterData[key]);
      }
    });

    // Add files if exists
    if (characterData.icon) {
      formData.append("icon", characterData.icon);
    }

    if (characterData.gachaImg) {
      formData.append("gachaImg", characterData.gachaImg);
    }

    return api.post("/characters", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Update character
  updateCharacter: (id, characterData) => {
    const formData = new FormData();

    // Add character data to formData
    Object.keys(characterData).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(key, characterData[key]);
      }
    });

    // Add files if exists
    if (characterData.icon) {
      formData.append("icon", characterData.icon);
    }

    if (characterData.gachaImg) {
      formData.append("gachaImg", characterData.gachaImg);
    }

    return api.put(`/characters/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Delete character
  deleteCharacter: (id, permanent = false) => {
    return api.delete(`/characters/${id}`, {
      params: { permanent },
    });
  },

  // Character skills management
  addCharacterTalent: (characterId, talentData) => {
    return api.post(`/skills/talents/${characterId}`, talentData);
  },

  addCharacterPassive: (characterId, passiveData) => {
    return api.post(`/skills/passives/${characterId}`, passiveData);
  },

  addCharacterConstellation: (characterId, constellationData) => {
    const formData = new FormData();

    Object.keys(constellationData).forEach((key) => {
      if (key !== "constellationIcon") {
        formData.append(key, constellationData[key]);
      }
    });

    if (constellationData.constellationIcon) {
      formData.append("constellationIcon", constellationData.constellationIcon);
    }

    return api.post(`/skills/constellations/${characterId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  bulkAddCharacterSkills: (characterId, skillsData) => {
    return api.post(`/skills/bulk/${characterId}`, skillsData);
  },

  // Character stats management
  addCharacterStats: (characterId, statsData) => {
    return api.post(`/stats/character/${characterId}`, statsData);
  },

  updateCharacterStat: (statId, statData) => {
    return api.put(`/stats/${statId}`, statData);
  },

  previewCharacterStats: (statsData) => {
    return api.post("/stats/preview", statsData);
  },
};

export default characterService;
