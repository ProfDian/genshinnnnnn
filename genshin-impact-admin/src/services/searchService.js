import api from "./api";

// Service untuk mengakses search API
const searchService = {
  // Perform advanced search
  advancedSearch: async (searchParams) => {
    try {
      const {
        query, // General search term
        entityType = "all", // "character", "weapon", or "all"
        filters = {}, // Object containing filters
        sortBy, // Sort field
        sortOrder, // asc or desc
        page = 1,
        limit = 20,
      } = searchParams;

      // Convert filters object to JSON string
      const filtersStr = JSON.stringify(filters);

      // Build query parameters
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      params.append("entityType", entityType);
      params.append("filters", filtersStr);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);
      params.append("page", page);
      params.append("limit", limit);

      const response = await api.get(`/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error performing search:", error);
      throw error;
    }
  },
};

export default searchService;
