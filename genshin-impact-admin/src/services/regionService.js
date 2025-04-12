import api from "./api";

const regionService = {
  // Get all regions
  getAllRegions: async () => {
    const response = await api.get("/regions");
    return response.data;
  },

  // Get a single region by ID
  getRegionById: async (id) => {
    const response = await api.get(`/regions/${id}`);
    return response.data;
  },

  // Get characters by region
  getCharactersByRegion: async (regionId) => {
    const response = await api.get(`/regions/${regionId}/characters`);
    return response.data;
  },

  // Create a new region
  createRegion: async (regionData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add region basic info
    Object.keys(regionData).forEach((key) => {
      if (key !== "regionIcon") {
        formData.append(key, regionData[key]);
      }
    });

    // Add region icon if it exists
    if (regionData.regionIcon instanceof File) {
      formData.append("regionIcon", regionData.regionIcon);
    }

    const response = await api.post("/regions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update a region
  updateRegion: async (id, regionData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add region basic info
    Object.keys(regionData).forEach((key) => {
      if (key !== "regionIcon") {
        formData.append(key, regionData[key]);
      }
    });

    // Add region icon if it exists and is a File object (new upload)
    if (regionData.regionIcon instanceof File) {
      formData.append("regionIcon", regionData.regionIcon);
    }

    const response = await api.put(`/regions/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Add a region area
  addRegionArea: async (regionId, areaData) => {
    // Use FormData for file uploads
    const formData = new FormData();

    // Add area basic info
    Object.keys(areaData).forEach((key) => {
      if (key !== "areaImage") {
        formData.append(key, areaData[key]);
      }
    });

    // Add area image if it exists
    if (areaData.areaImage instanceof File) {
      formData.append("areaImage", areaData.areaImage);
    }

    const response = await api.post(`/regions/${regionId}/areas`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Add a region feature
  addRegionFeature: async (regionId, featureData) => {
    const response = await api.post(
      `/regions/${regionId}/features`,
      featureData
    );
    return response.data;
  },
};

export default regionService;
