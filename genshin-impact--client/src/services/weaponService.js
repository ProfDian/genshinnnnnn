// src/services/weaponService.js
import api from "./api";

const weaponService = {
  // Get all weapons with filtering, pagination
  getAllWeapons: (params = {}) => {
    return api.get("/weapons", { params });
  },

  // Get weapon types
  getWeaponTypes: () => {
    return api.get("/weapon-types");
  },

  // Get weapon detail by ID
  getWeaponById: (id) => {
    return api.get(`/weapons/${id}`);
  },

  // Get weapon stats
  getWeaponStats: (weaponId) => {
    return api.get(`/weapon-stats/weapon/${weaponId}`);
  },

  // Get substat types
  getSubstatTypes: () => {
    return api.get("/weapon-stats/subtypes");
  },

  // Admin: Create weapon
  createWeapon: (weaponData) => {
    const formData = new FormData();

    // Handle nested data
    if (typeof weaponData.weapon === "object") {
      Object.keys(weaponData.weapon).forEach((key) => {
        if (key !== "icon") {
          formData.append(`weapon[${key}]`, weaponData.weapon[key]);
        }
      });
    }

    if (typeof weaponData.stats === "object") {
      Object.keys(weaponData.stats).forEach((key) => {
        formData.append(`stats[${key}]`, weaponData.stats[key]);
      });
    }

    // Handle passives array
    if (Array.isArray(weaponData.passives)) {
      weaponData.passives.forEach((passive, index) => {
        Object.keys(passive).forEach((key) => {
          formData.append(`passives[${index}][${key}]`, passive[key]);
        });
      });
    }

    // Handle refinements array
    if (Array.isArray(weaponData.refinements)) {
      weaponData.refinements.forEach((refinement, index) => {
        Object.keys(refinement).forEach((key) => {
          formData.append(`refinements[${index}][${key}]`, refinement[key]);
        });
      });
    }

    // Add icon if exists
    if (weaponData.weapon && weaponData.weapon.icon) {
      formData.append("icon", weaponData.weapon.icon);
    }

    return api.post("/weapons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Update weapon
  updateWeapon: (id, weaponData) => {
    const formData = new FormData();

    // Add weapon data to formData
    Object.keys(weaponData).forEach((key) => {
      if (key !== "icon") {
        formData.append(key, weaponData[key]);
      }
    });

    // Add icon if exists
    if (weaponData.icon) {
      formData.append("icon", weaponData.icon);
    }

    return api.put(`/weapons/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Delete weapon
  deleteWeapon: (id, permanent = false) => {
    return api.delete(`/weapons/${id}`, {
      params: { permanent },
    });
  },

  // Admin: Add weapon stats
  addWeaponStats: (weaponId, statsData) => {
    return api.post(`/weapon-stats/weapon/${weaponId}`, statsData);
  },

  // Admin: Update weapon stat
  updateWeaponStat: (statId, statData) => {
    return api.put(`/weapon-stats/${statId}`, statData);
  },

  // Admin: Preview weapon stats
  previewWeaponStats: (statsData) => {
    return api.post("/weapon-stats/preview", statsData);
  },
};

export default weaponService;
