const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user favorites - uses JOIN queries but transforms response
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Still using complex JOIN query to satisfy the requirement
    const rawFavorites = await prisma.$queryRaw`
      SELECT 
        uf.id as id,
        uf.favorite_type as favoriteType,
        uf.user_id as userId,
        
        -- Character data
        c.id as characterId,
        c.name as characterName,
        c.title as characterTitle,
        c.icon as characterIcon,
        
        -- Element data
        e.element_name as elementName,
        e.element_color as elementColor,
        e.element_icon as elementIcon,
        
        -- Weapon data
        w.id as weaponId,
        w.name as weaponName,
        w.icon as weaponIcon,
        
        -- Weapon type data
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN wt1.weapon_type_name
          WHEN uf.favorite_type = 'WEAPON' THEN wt2.weapon_type_name
          ELSE NULL
        END as weaponTypeName,
        
        -- Region data
        r.region_name as regionName,
        
        -- Rarity data
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN ra1.rarity_value
          WHEN uf.favorite_type = 'WEAPON' THEN ra2.rarity_value
          ELSE NULL
        END as rarityValue,
        
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN ra1.rarity_color
          WHEN uf.favorite_type = 'WEAPON' THEN ra2.rarity_color
          ELSE NULL
        END as rarityColor,
        
        uf.created_at as createdAt
        
      FROM user_favorites uf
      JOIN users u ON uf.user_id = u.id
      
      -- LEFT JOIN for character and related tables
      LEFT JOIN characters c ON uf.character_id = c.id AND uf.favorite_type = 'CHARACTER'
      LEFT JOIN elements e ON c.element_id = e.id
      LEFT JOIN weapon_types wt1 ON c.weapon_type_id = wt1.id
      LEFT JOIN regions r ON c.region_id = r.id
      LEFT JOIN rarities ra1 ON c.rarity_id = ra1.id
      
      -- LEFT JOIN for weapon and related tables
      LEFT JOIN weapons w ON uf.weapon_id = w.id AND uf.favorite_type = 'WEAPON'
      LEFT JOIN weapon_types wt2 ON w.weapon_type_id = wt2.id
      LEFT JOIN rarities ra2 ON w.rarity_id = ra2.id
      
      WHERE uf.user_id = ${userId}
      ORDER BY uf.created_at DESC
    `;

    // Transform the results to a more efficient structure
    const favorites = rawFavorites.map((item) => {
      // Common base properties
      const favorite = {
        id: item.id,
        favoriteType: item.favoriteType,
        userId: item.userId,
        createdAt: item.createdAt,
      };

      // Add type-specific data
      if (item.favoriteType === "CHARACTER") {
        favorite.character = {
          id: item.characterId,
          name: item.characterName,
          title: item.characterTitle,
          icon: item.characterIcon,
          weaponType: item.weaponTypeName,
          element: {
            name: item.elementName,
            color: item.elementColor,
            icon: item.elementIcon,
          },
          region: item.regionName,
          rarity: {
            value: item.rarityValue,
            color: item.rarityColor,
          },
        };
      } else if (item.favoriteType === "WEAPON") {
        favorite.weapon = {
          id: item.weaponId,
          name: item.weaponName,
          icon: item.weaponIcon,
          weaponType: item.weaponTypeName,
          rarity: {
            value: item.rarityValue,
            color: item.rarityColor,
          },
        };
      }

      return favorite;
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Get user favorites error:", error);
    res.status(500).json({ message: "Error fetching user favorites" });
  }
};

// Get user favorites by ID - for profile pages
const getUserFavoritesById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Keep the complex JOIN query
    const rawFavorites = await prisma.$queryRaw`
      SELECT 
        uf.id as id,
        uf.favorite_type as favoriteType,
        uf.user_id as userId,
        
        -- Character data
        c.id as characterId,
        c.name as characterName,
        c.title as characterTitle,
        c.icon as characterIcon,
        
        -- Element data
        e.element_name as elementName,
        e.element_color as elementColor,
        e.element_icon as elementIcon,
        
        -- Weapon data
        w.id as weaponId,
        w.name as weaponName,
        w.icon as weaponIcon,
        
        -- Weapon type data
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN wt1.weapon_type_name
          WHEN uf.favorite_type = 'WEAPON' THEN wt2.weapon_type_name
          ELSE NULL
        END as weaponTypeName,
        
        -- Region data
        r.region_name as regionName,
        
        -- Rarity data
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN ra1.rarity_value
          WHEN uf.favorite_type = 'WEAPON' THEN ra2.rarity_value
          ELSE NULL
        END as rarityValue,
        
        CASE 
          WHEN uf.favorite_type = 'CHARACTER' THEN ra1.rarity_color
          WHEN uf.favorite_type = 'WEAPON' THEN ra2.rarity_color
          ELSE NULL
        END as rarityColor,
        
        uf.created_at as createdAt
        
      FROM user_favorites uf
      JOIN users u ON uf.user_id = u.id
      
      -- LEFT JOIN for character and related tables
      LEFT JOIN characters c ON uf.character_id = c.id AND uf.favorite_type = 'CHARACTER'
      LEFT JOIN elements e ON c.element_id = e.id
      LEFT JOIN weapon_types wt1 ON c.weapon_type_id = wt1.id
      LEFT JOIN regions r ON c.region_id = r.id
      LEFT JOIN rarities ra1 ON c.rarity_id = ra1.id
      
      -- LEFT JOIN for weapon and related tables
      LEFT JOIN weapons w ON uf.weapon_id = w.id AND uf.favorite_type = 'WEAPON'
      LEFT JOIN weapon_types wt2 ON w.weapon_type_id = wt2.id
      LEFT JOIN rarities ra2 ON w.rarity_id = ra2.id
      
      WHERE uf.user_id = ${parseInt(userId)}
      ORDER BY uf.created_at DESC
    `;

    // Transform the results like in getUserFavorites
    const favorites = rawFavorites.map((item) => {
      const favorite = {
        id: item.id,
        favoriteType: item.favoriteType,
        userId: item.userId,
        createdAt: item.createdAt,
      };

      if (item.favoriteType === "CHARACTER") {
        favorite.character = {
          id: item.characterId,
          name: item.characterName,
          title: item.characterTitle,
          icon: item.characterIcon,
          weaponType: item.weaponTypeName,
          element: {
            name: item.elementName,
            color: item.elementColor,
            icon: item.elementIcon,
          },
          region: item.regionName,
          rarity: {
            value: item.rarityValue,
            color: item.rarityColor,
          },
        };
      } else if (item.favoriteType === "WEAPON") {
        favorite.weapon = {
          id: item.weaponId,
          name: item.weaponName,
          icon: item.weaponIcon,
          weaponType: item.weaponTypeName,
          rarity: {
            value: item.rarityValue,
            color: item.rarityColor,
          },
        };
      }

      return favorite;
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Get user favorites by ID error:", error);
    res.status(500).json({ message: "Error fetching user favorites" });
  }
};

// Add to favorites - with enhanced response
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

    // After creating the favorite, fetch its complete details
    let completeData;

    if (favoriteType === "CHARACTER") {
      completeData = await prisma.$queryRaw`
        SELECT 
          uf.id as id,
          uf.favorite_type as favoriteType,
          uf.user_id as userId,
          c.id as characterId,
          c.name as characterName,
          c.title as characterTitle,
          c.icon as characterIcon,
          e.element_name as elementName,
          e.element_color as elementColor,
          e.element_icon as elementIcon,
          wt.weapon_type_name as weaponTypeName,
          r.region_name as regionName,
          ra.rarity_value as rarityValue,
          ra.rarity_color as rarityColor,
          uf.created_at as createdAt
        FROM user_favorites uf
        JOIN characters c ON uf.character_id = c.id
        LEFT JOIN elements e ON c.element_id = e.id
        LEFT JOIN weapon_types wt ON c.weapon_type_id = wt.id
        LEFT JOIN regions r ON c.region_id = r.id
        LEFT JOIN rarities ra ON c.rarity_id = ra.id
        WHERE uf.id = ${favorite.id}
      `;
    } else {
      completeData = await prisma.$queryRaw`
        SELECT 
          uf.id as id,
          uf.favorite_type as favoriteType,
          uf.user_id as userId,
          w.id as weaponId,
          w.name as weaponName,
          w.icon as weaponIcon,
          wt.weapon_type_name as weaponTypeName,
          ra.rarity_value as rarityValue,
          ra.rarity_color as rarityColor,
          uf.created_at as createdAt
        FROM user_favorites uf
        JOIN weapons w ON uf.weapon_id = w.id
        LEFT JOIN weapon_types wt ON w.weapon_type_id = wt.id
        LEFT JOIN rarities ra ON w.rarity_id = ra.id
        WHERE uf.id = ${favorite.id}
      `;
    }

    // Should have only one result
    const data = completeData[0];

    // Transform the response to our structured format
    const responseData = {
      id: data.id,
      favoriteType: data.favoriteType,
      userId: data.userId,
      createdAt: data.createdAt,
    };

    if (data.favoriteType === "CHARACTER") {
      responseData.character = {
        id: data.characterId,
        name: data.characterName,
        title: data.characterTitle,
        icon: data.characterIcon,
        weaponType: data.weaponTypeName,
        element: {
          name: data.elementName,
          color: data.elementColor,
          icon: data.elementIcon,
        },
        region: data.regionName,
        rarity: {
          value: data.rarityValue,
          color: data.rarityColor,
        },
      };
    } else {
      responseData.weapon = {
        id: data.weaponId,
        name: data.weaponName,
        icon: data.weaponIcon,
        weaponType: data.weaponTypeName,
        rarity: {
          value: data.rarityValue,
          color: data.rarityColor,
        },
      };
    }

    res.status(201).json({
      message: "Added to favorites",
      favorite: responseData,
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
      favoriteId: parseInt(id),
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
  getUserFavoritesById,
  addToFavorites,
  removeFromFavorites,
  getAllUsers,
  toggleAdminStatus,
};
