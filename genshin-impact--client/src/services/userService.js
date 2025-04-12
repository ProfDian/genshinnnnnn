// src/services/userService.js
import api from "./api";

const userService = {
  // Get user favorites
  getUserFavorites: () => {
    return api.get("/user/favorites");
  },

  // Get user favorites by user ID (for profiles)
  getUserFavoritesById: (userId) => {
    return api.get(`/user/favorites/${userId}`);
  },

  // Add to favorites
  addToFavorites: (favoriteData) => {
    return api.post("/user/favorites", favoriteData);
  },

  // Remove from favorites
  removeFromFavorites: (favoriteId) => {
    return api.delete(`/user/favorites/${favoriteId}`);
  },

  // Check if item is in favorites
  checkFavoriteStatus: async (type, itemId) => {
    try {
      const response = await api.get("/user/favorites");
      return response.data.some(
        (fav) =>
          fav.favoriteType === type &&
          (type === "CHARACTER"
            ? fav.character?.id === parseInt(itemId)
            : fav.weapon?.id === parseInt(itemId))
      );
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },

  // Find favorite ID for removal
  findFavoriteId: async (type, itemId) => {
    try {
      const response = await api.get("/user/favorites");
      const favorite = response.data.find(
        (fav) =>
          fav.favoriteType === type &&
          (type === "CHARACTER"
            ? fav.character?.id === parseInt(itemId)
            : fav.weapon?.id === parseInt(itemId))
      );
      return favorite ? favorite.id : null;
    } catch (error) {
      console.error("Error finding favorite:", error);
      return null;
    }
  },

  // Admin: Get all users
  getAllUsers: () => {
    return api.get("/user/all");
  },

  // Admin: Toggle user admin status
  toggleAdminStatus: (userId) => {
    return api.put(`/user/${userId}/toggle-admin`);
  },
};

export default userService;
