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
    const response = await api.get("/reference/elements");
    console.log(response.data);
    return response.data;
  },

  // Get weapon types (for dropdown menus)
  getWeaponTypes: async () => {
    const response = await api.get("/reference/weapon-types");
    return response.data;
  },

  // Get rarities (for dropdown menus)
  getRarities: async () => {
    const response = await api.get("/rarities");
    return response.data;
  },

  getAllRegions: async () => {
    const response = await api.get("/regions");
    return response.data;
  },
  // Get stat types (untuk dropdown pemilihan stat type)
  getStatTypes: async () => {
    const response = await api.get("/stats/types");
    return response.data;
  },

  // Preview character stats berdasarkan input
  previewCharacterStats: async (statsData) => {
    const response = await api.post("/stats/preview", statsData);
    return response.data;
  },

  // Get level ascension map (untuk menampilkan tabel stats)
  getLevelAscensionMap: async () => {
    const response = await api.get("/stats/level-map");
    return response.data;
  },

  // Get base stat values (untuk perhitungan stats)
  getBaseStatValues: async () => {
    const response = await api.get("/stats/base-values");
    return response.data;
  },

  // Update existing talent
  updateCharacterTalent: async (talentId, talentData) => {
    const response = await api.put(`/skills/talents/${talentId}`, talentData);
    return response.data;
  },

  // Update existing passive
  updateCharacterPassive: async (passiveId, passiveData) => {
    const response = await api.put(
      `/skills/passives/${passiveId}`,
      passiveData
    );
    return response.data;
  },

  // Update existing constellation
  updateCharacterConstellation: async (constellationId, constellationData) => {
    // Use FormData for file uploads if constellationIcon is provided
    if (constellationData.constellationIcon instanceof File) {
      const formData = new FormData();

      Object.keys(constellationData).forEach((key) => {
        if (key !== "constellationIcon") {
          formData.append(key, constellationData[key]);
        }
      });

      formData.append("constellationIcon", constellationData.constellationIcon);

      const response = await api.put(
        `/skills/constellations/${constellationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } else {
      const response = await api.put(
        `/skills/constellations/${constellationId}`,
        constellationData
      );
      return response.data;
    }
  },

  // Delete a talent
  deleteCharacterTalent: async (talentId) => {
    const response = await api.delete(`/skills/talents/${talentId}`);
    return response.data;
  },

  // Delete a passive
  deleteCharacterPassive: async (passiveId) => {
    const response = await api.delete(`/skills/passives/${passiveId}`);
    return response.data;
  },

  // Delete a constellation
  deleteCharacterConstellation: async (constellationId) => {
    const response = await api.delete(
      `/skills/constellations/${constellationId}`
    );
    return response.data;
  },

  // Create a complete character with all related data in one request
  createCompleteCharacter: async (characterData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add character basic info
    Object.keys(characterData.basicInfo).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(`basicInfo[${key}]`, characterData.basicInfo[key]);
      }
    });

    // Add files if they exist
    if (characterData.basicInfo.icon) {
      formData.append("icon", characterData.basicInfo.icon);
    }

    if (characterData.basicInfo.gachaImg) {
      formData.append("gachaImg", characterData.basicInfo.gachaImg);
    }

    // Add stats data
    if (characterData.stats) {
      Object.keys(characterData.stats).forEach((key) => {
        formData.append(
          `stats[${key}]`,
          typeof characterData.stats[key] === "object"
            ? JSON.stringify(characterData.stats[key])
            : characterData.stats[key]
        );
      });
    }

    // Add talents data
    if (characterData.talents && characterData.talents.length) {
      characterData.talents.forEach((talent, index) => {
        Object.keys(talent).forEach((key) => {
          formData.append(`talents[${index}][${key}]`, talent[key]);
        });
      });
    }

    // Add passives data
    if (characterData.passives && characterData.passives.length) {
      characterData.passives.forEach((passive, index) => {
        Object.keys(passive).forEach((key) => {
          formData.append(`passives[${index}][${key}]`, passive[key]);
        });
      });
    }

    // Add constellations data and icons
    if (characterData.constellations && characterData.constellations.length) {
      characterData.constellations.forEach((constellation, index) => {
        Object.keys(constellation).forEach((key) => {
          if (key !== "constellationIcon") {
            formData.append(
              `constellations[${index}][${key}]`,
              constellation[key]
            );
          }
        });

        // Add constellation icon if it exists
        if (constellation.constellationIcon instanceof File) {
          formData.append(
            `constellationIcons[${index}]`,
            constellation.constellationIcon
          );
        }
      });
    }

    const response = await api.post("/characters/complete", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update a complete character with all related data
  updateCompleteCharacter: async (id, characterData) => {
    // Similar to createCompleteCharacter but with PUT request
    const formData = new FormData();

    // Add character basic info
    Object.keys(characterData.basicInfo).forEach((key) => {
      if (key !== "icon" && key !== "gachaImg") {
        formData.append(`basicInfo[${key}]`, characterData.basicInfo[key]);
      }
    });

    // Add files if they exist and are new uploads
    if (characterData.basicInfo.icon instanceof File) {
      formData.append("icon", characterData.basicInfo.icon);
    }

    if (characterData.basicInfo.gachaImg instanceof File) {
      formData.append("gachaImg", characterData.basicInfo.gachaImg);
    }

    // Add stats data
    if (characterData.stats) {
      Object.keys(characterData.stats).forEach((key) => {
        formData.append(
          `stats[${key}]`,
          typeof characterData.stats[key] === "object"
            ? JSON.stringify(characterData.stats[key])
            : characterData.stats[key]
        );
      });
    }

    // Add talents data
    if (characterData.talents && characterData.talents.length) {
      characterData.talents.forEach((talent, index) => {
        Object.keys(talent).forEach((key) => {
          formData.append(`talents[${index}][${key}]`, talent[key]);
        });
      });
    }

    // Add passives data
    if (characterData.passives && characterData.passives.length) {
      characterData.passives.forEach((passive, index) => {
        Object.keys(passive).forEach((key) => {
          formData.append(`passives[${index}][${key}]`, passive[key]);
        });
      });
    }

    // Add constellations data and icons
    if (characterData.constellations && characterData.constellations.length) {
      characterData.constellations.forEach((constellation, index) => {
        Object.keys(constellation).forEach((key) => {
          if (key !== "constellationIcon") {
            formData.append(
              `constellations[${index}][${key}]`,
              constellation[key]
            );
          }
        });

        // Add constellation icon if it exists
        if (constellation.constellationIcon instanceof File) {
          formData.append(
            `constellationIcons[${index}]`,
            constellation.constellationIcon
          );
        }
      });
    }

    const response = await api.put(`/characters/complete/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

export default characterService;
