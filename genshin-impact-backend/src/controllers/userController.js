const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user favorites
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await prisma.userFavoritesView.findMany({
      where: { userId: req.user.id },
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Get user favorites error:", error);
    res.status(500).json({ message: "Error fetching user favorites" });
  }
};

// Add to favorites
const addToFavorites = async (req, res) => {
  try {
    const { favoriteType, characterId, weaponId } = req.body;

    // Validate data
    if (favoriteType !== "CHARACTER" && favoriteType !== "WEAPON") {
      return res.status(400).json({ message: "Invalid favorite type" });
    }

    if (favoriteType === "CHARACTER" && !characterId) {
      return res.status(400).json({ message: "Character ID is required" });
    }

    if (favoriteType === "WEAPON" && !weaponId) {
      return res.status(400).json({ message: "Weapon ID is required" });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.userFavorite.findFirst({
      where: {
        userId: req.user.id,
        favoriteType,
        ...(favoriteType === "CHARACTER"
          ? { characterId: parseInt(characterId) }
          : {}),
        ...(favoriteType === "WEAPON" ? { weaponId: parseInt(weaponId) } : {}),
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Item already in favorites" });
    }

    // Add to favorites
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: req.user.id,
        favoriteType,
        ...(favoriteType === "CHARACTER"
          ? { characterId: parseInt(characterId) }
          : {}),
        ...(favoriteType === "WEAPON" ? { weaponId: parseInt(weaponId) } : {}),
      },
    });

    res.status(201).json({
      message: "Added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: "Error adding to favorites" });
  }
};

// Remove from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if favorite exists and belongs to user
    const favorite = await prisma.userFavorite.findUnique({
      where: { id: parseInt(id) },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    if (favorite.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove from favorites
    await prisma.userFavorite.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({ message: "Error removing from favorites" });
  }
};

// Admin: Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        isAdmin: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Admin: Toggle user admin status (admin only)
const toggleAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { isAdmin: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { isAdmin: !user.isAdmin },
      select: {
        id: true,
        username: true,
        isAdmin: true,
      },
    });

    res.status(200).json({
      message: `User ${
        updatedUser.isAdmin ? "promoted to admin" : "demoted from admin"
      }`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Toggle admin error:", error);
    res.status(500).json({ message: "Error updating user admin status" });
  }
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getAllUsers,
  toggleAdminStatus,
};
