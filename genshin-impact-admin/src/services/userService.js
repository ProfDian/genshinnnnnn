import api from "./api";

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get("/user/all");
    return response.data;
  },

  // Toggle user admin status
  toggleAdminStatus: async (userId) => {
    const response = await api.put(`/user/${userId}/toggle-admin`);
    return response.data;
  },

  // Get user favorites by ID
  getUserFavorites: async (userId) => {
    const response = await api.get(`/user/favorites/${userId}`);
    return response.data;
  },
};

export default userService;
