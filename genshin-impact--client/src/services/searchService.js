// src/services/searchService.js
import api from "./api";

const searchService = {
  // Advanced search across entities
  advancedSearch: (searchParams) => {
    return api.get("/search", { params: searchParams });
  },
};

export default searchService;
