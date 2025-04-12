import api from "./api";

const weaponService = {
  // Get all weapons with pagination, filtering, and sorting
  getWeapons: async (params = {}) => {
    const response = await api.get("/weapons", { params });
    return response.data;
  },

  // Get a single weapon by ID
  getWeaponById: async (id) => {
    const response = await api.get(`/weapons/${id}`);
    return response.data;
  },

  // Create a new weapon
  createWeapon: async (weaponData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add weapon basic info
    if (weaponData.weapon) {
      Object.keys(weaponData.weapon).forEach((key) => {
        if (key !== "icon") {
          formData.append(`weapon[${key}]`, weaponData.weapon[key]);
        }
      });
    }

    // Add stats data
    if (weaponData.stats) {
      Object.keys(weaponData.stats).forEach((key) => {
        formData.append(`stats[${key}]`, weaponData.stats[key]);
      });
    }

    // Add passives data
    if (weaponData.passives && weaponData.passives.length) {
      weaponData.passives.forEach((passive, index) => {
        Object.keys(passive).forEach((key) => {
          formData.append(`passives[${index}][${key}]`, passive[key]);
        });
      });
    }

    // Add refinements data
    if (weaponData.refinements && weaponData.refinements.length) {
      weaponData.refinements.forEach((refinement, index) => {
        Object.keys(refinement).forEach((key) => {
          formData.append(`refinements[${index}][${key}]`, refinement[key]);
        });
      });
    }

    // Add weapon icon if it exists
    if (weaponData.weapon && weaponData.weapon.icon instanceof File) {
      formData.append("icon", weaponData.weapon.icon);
    }

    const response = await api.post("/weapons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update a weapon
  updateWeapon: async (id, weaponData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add weapon basic info
    Object.keys(weaponData).forEach((key) => {
      if (key !== "icon") {
        formData.append(key, weaponData[key]);
      }
    });

    // Add icon if it exists and is a File object (new upload)
    if (weaponData.icon instanceof File) {
      formData.append("icon", weaponData.icon);
    }

    const response = await api.put(`/weapons/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Delete a weapon (soft delete by default)
  deleteWeapon: async (id, permanent = false) => {
    const response = await api.delete(`/weapons/${id}`, {
      params: { permanent },
    });

    return response.data;
  },

  // Get weapon stats
  getWeaponStats: async (weaponId) => {
    const response = await api.get(`/weapon-stats/weapon/${weaponId}`);
    return response.data;
  },

  // Add weapon stats
  addWeaponStats: async (weaponId, statsData) => {
    const response = await api.post(
      `/weapon-stats/weapon/${weaponId}`,
      statsData
    );
    return response.data;
  },

  // Get weapon types (for dropdown menus)
  getWeaponTypes: async () => {
    const response = await api.get("/weapon-stats/types");
    return response.data;
  },

  // Get weapon substat types (for dropdown menus)
  getSubstatTypes: async () => {
    const response = await api.get("/weapon-stats/subtypes");
    return response.data;
  },

  // Preview weapon stats based on input parameters (without saving)
  previewWeaponStats: async (statsData) => {
    const response = await api.post("/weapon-stats/preview", statsData);
    return response.data;
  },
};

export default weaponService;
