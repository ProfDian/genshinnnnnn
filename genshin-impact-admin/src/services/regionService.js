import api from "./api";

// Service untuk mengakses region API
const regionService = {
  // Get all regions
  getAllRegions: async () => {
    try {
      const response = await api.get("/regions");
      return response.data;
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  },

  // Get specific region by ID
  getRegionById: async (regionId) => {
    try {
      const response = await api.get(`/regions/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching region with ID ${regionId}:`, error);
      throw error;
    }
  },

  // Get characters from a specific region
  getCharactersByRegion: async (regionId) => {
    try {
      const response = await api.get(`/regions/${regionId}/characters`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching characters from region with ID ${regionId}:`,
        error
      );
      throw error;
    }
  },

  // Create a new region (admin only)
  createRegion: async (regionData) => {
    try {
      // Handle file upload for region icon
      const formData = new FormData();

      // Add all fields from regionData to formData
      Object.keys(regionData).forEach((key) => {
        if (key === "regionIcon" && regionData[key] instanceof File) {
          formData.append("regionIcon", regionData[key]);
        } else {
          formData.append(key, regionData[key]);
        }
      });

      const response = await api.post("/regions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating region:", error);
      throw error;
    }
  },

  // Update an existing region (admin only)
  updateRegion: async (regionId, regionData) => {
    try {
      // Handle file upload for region icon
      const formData = new FormData();

      // Add all fields from regionData to formData
      Object.keys(regionData).forEach((key) => {
        if (key === "regionIcon" && regionData[key] instanceof File) {
          formData.append("regionIcon", regionData[key]);
        } else {
          formData.append(key, regionData[key]);
        }
      });

      const response = await api.put(`/regions/${regionId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating region with ID ${regionId}:`, error);
      throw error;
    }
  },

  // Add a new area to a region (admin only)
  addRegionArea: async (regionId, areaData) => {
    try {
      // Handle file upload for area image
      const formData = new FormData();

      // Add all fields from areaData to formData
      Object.keys(areaData).forEach((key) => {
        if (key === "areaImage" && areaData[key] instanceof File) {
          formData.append("areaImage", areaData[key]);
        } else {
          formData.append(key, areaData[key]);
        }
      });

      const response = await api.post(`/regions/${regionId}/areas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error adding area to region with ID ${regionId}:`, error);
      throw error;
    }
  },

  // Add a new feature to a region (admin only)
  addRegionFeature: async (regionId, featureData) => {
    try {
      const response = await api.post(
        `/regions/${regionId}/features`,
        featureData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error adding feature to region with ID ${regionId}:`,
        error
      );
      throw error;
    }
  },
  // Get all deleted region areas (admin only)
  getDeletedAreas: async () => {
    try {
      const response = await api.get("/regions/areas/trash");
      return response.data;
    } catch (error) {
      console.error("Error fetching deleted areas:", error);
      throw error;
    }
  },

  // Restore a soft-deleted region area (admin only)
  restoreArea: async (areaId) => {
    try {
      const response = await api.put(`/regions/areas/${areaId}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Error restoring area with ID ${areaId}:`, error);
      throw error;
    }
  },

  // Delete region area (soft delete)
  deleteArea: async (areaId) => {
    try {
      const response = await api.delete(`/regions/areas/${areaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting area with ID ${areaId}:`, error);
      throw error;
    }
  },

  // Permanently delete region area
  deleteAreaPermanently: async (areaId) => {
    try {
      const response = await api.delete(
        `/regions/areas/${areaId}?permanent=true`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error permanently deleting area with ID ${areaId}:`,
        error
      );
      throw error;
    }
  },
  // Update an existing region area
  updateRegionArea: async (areaId, areaData) => {
    try {
      // Handle file upload for area image
      const formData = new FormData();

      // Add all fields from areaData to formData
      Object.keys(areaData).forEach((key) => {
        formData.append(key, areaData[key]);
      });

      const response = await api.put(`/regions/areas/${areaId}`, formData);
      return response.data;
    } catch (error) {
      console.error(`Error updating area with ID ${areaId}:`, error);
      throw error;
    }
  },

  // Update an existing region feature
  updateRegionFeature: async (featureId, featureData) => {
    try {
      const response = await api.put(
        `/regions/features/${featureId}`,
        featureData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating feature with ID ${featureId}:`, error);
      throw error;
    }
  },
};

export default regionService;
