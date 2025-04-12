// src/services/regionService.js
import api from "./api";

const regionService = {
  // Get all regions
  getAllRegions: () => {
    return api.get("/regions");
  },

  // Get region by ID
  getRegionById: (id) => {
    return api.get(`/regions/${id}`);
  },

  // Get characters by region
  getCharactersByRegion: (regionId) => {
    return api.get(`/regions/${regionId}/characters`);
  },

  // Admin: Create region
  createRegion: (regionData) => {
    const formData = new FormData();

    // Add region data to formData
    Object.keys(regionData).forEach((key) => {
      if (key !== "regionIcon") {
        formData.append(key, regionData[key]);
      }
    });

    // Add icon if exists
    if (regionData.regionIcon) {
      formData.append("regionIcon", regionData.regionIcon);
    }

    return api.post("/regions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Update region
  updateRegion: (id, regionData) => {
    const formData = new FormData();

    // Add region data to formData
    Object.keys(regionData).forEach((key) => {
      if (key !== "regionIcon") {
        formData.append(key, regionData[key]);
      }
    });

    // Add icon if exists
    if (regionData.regionIcon) {
      formData.append("regionIcon", regionData.regionIcon);
    }

    return api.put(`/regions/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Add region area
  addRegionArea: (regionId, areaData) => {
    const formData = new FormData();

    // Add area data to formData
    Object.keys(areaData).forEach((key) => {
      if (key !== "areaImage") {
        formData.append(key, areaData[key]);
      }
    });

    // Add image if exists
    if (areaData.areaImage) {
      formData.append("areaImage", areaData.areaImage);
    }

    return api.post(`/regions/${regionId}/areas`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Admin: Add region feature
  addRegionFeature: (regionId, featureData) => {
    return api.post(`/regions/${regionId}/features`, featureData);
  },
};

export default regionService;
