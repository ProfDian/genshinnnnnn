const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const weaponStatService = require("../services/weaponStatService");

// Get all weapons with search and filter functionality
const getAllWeapons = async (req, res) => {
  try {
    const {
      search, // Search by name
      weaponTypeId, // Filter by weapon type
      rarityId, // Filter by rarity
      sortBy, // Sort options: 'name', 'baseAtk'
      sortOrder, // Sort direction: 'asc', 'desc'
      page = 1, // Pagination: current page
      limit = 20, // Pagination: items per page
    } = req.query;

    // Build filter conditions
    const where = {
      deletedAt: null,
    };

    // Add search filter if provided
    if (search) {
      where.OR = [{ name: { contains: search } }];
    }

    // Add other filters if provided
    if (weaponTypeId) where.weaponTypeId = parseInt(weaponTypeId);
    if (rarityId) where.rarityId = parseInt(rarityId);

    // Build sort options
    let orderBy = {};
    if (sortBy === "baseAtk") {
      // For baseAtk sorting, we need to include weapon_stats
      // Sort by first level's base ATK (complex query)
      orderBy = {
        weapon_stats: {
          _count: sortOrder === "desc" ? "desc" : "asc",
        },
      };
    } else {
      // Default to sorting by name
      orderBy.name = sortOrder === "desc" ? "desc" : "asc";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Execute query with filters, sorting, and pagination
    const [weapons, totalCount] = await Promise.all([
      prisma.weapon.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          weaponType: true,
          rarity: true,
        },
      }),
      prisma.weapon.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / take);

    res.status(200).json({
      weapons,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: take,
      },
    });
  } catch (error) {
    console.error("Get weapons error:", error);
    res.status(500).json({ message: "Error fetching weapons" });
  }
};

// Get weapon by ID
const getWeaponById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get weapon details using the Weapon model directly
    const weapon = await prisma.weapon.findUnique({
      where: { id: parseInt(id) },
      include: {
        weaponType: true,
        rarity: true,
        weapon_stats: true,
        passives: true,
        refinements: true,
      },
    });

    if (!weapon) {
      return res.status(404).json({ message: "Weapon not found" });
    }

    // Log user activity if logged in
    if (req.user) {
      await prisma.userActivity.create({
        data: {
          userId: req.user.id,
          activityType: "VIEW_WEAPON",
          relatedId: parseInt(id),
        },
      });
    }

    res.status(200).json(weapon);
  } catch (error) {
    console.error("Get weapon error:", error);
    res.status(500).json({ message: "Error fetching weapon" });
  }
};

// Create weapon (admin only)
const createWeapon = async (req, res) => {
  try {
    const { weapon, stats, passives, refinements } = req.body;

    // Get file URL if uploaded
    const icon = req.file ? req.file.path : null;

    // Tambahkan icon ke objek weapon jika ada
    if (icon) {
      weapon.icon = icon;
    }

    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create weapon
      const createdWeapon = await prisma.weapon.create({
        data: {
          name: weapon.name,
          description: weapon.description,
          weaponTypeId: parseInt(weapon.weaponTypeId),
          rarityId: parseInt(weapon.rarityId),
          specialProperty: weapon.specialProperty,
          icon: weapon.icon,
          story: weapon.story,
        },
      });

      // Generate and create weapon stats
      if (stats) {
        const weaponId = createdWeapon.id;
        const statsData = weaponStatService.generateAllWeaponStats(
          weaponId,
          stats.weaponType,
          stats.baseSubstat ? parseFloat(stats.baseSubstat) : null,
          stats.substatType
        );

        // Buat stats sekaligus
        await Promise.all(
          statsData.map((stat) => prisma.weaponStat.create({ data: stat }))
        );
      }

      // Create passives if provided
      if (passives && passives.length > 0) {
        await Promise.all(
          passives.map((passive) =>
            prisma.weaponPassive.create({
              data: {
                weaponId: createdWeapon.id,
                passiveName: passive.passiveName,
                passiveDescription: passive.passiveDescription,
              },
            })
          )
        );
      }

      // Create refinements if provided
      if (refinements && refinements.length > 0) {
        await Promise.all(
          refinements.map((refinement) =>
            prisma.weaponRefinement.create({
              data: {
                weaponId: createdWeapon.id,
                refinementLevel: refinement.refinementLevel,
                refinementDescription: refinement.refinementDescription,
              },
            })
          )
        );
      }

      return createdWeapon;
    });

    res.status(201).json({
      message: "Weapon created successfully with all related data",
      weapon: result,
    });
  } catch (error) {
    console.error("Create weapon error:", error);
    res
      .status(500)
      .json({ message: "Error creating weapon", error: error.message });
  }
};

// Update weapon (admin only)
const updateWeapon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      weaponTypeId,
      rarityId,
      specialProperty,
      story,
    } = req.body;

    // Prepare update data
    const updateData = {
      name,
      description,
      weaponTypeId: weaponTypeId ? parseInt(weaponTypeId) : undefined,
      rarityId: rarityId ? parseInt(rarityId) : undefined,
      specialProperty,
      story,
    };

    // Add icon if uploaded
    if (req.file) {
      updateData.icon = req.file.path;
    }

    // Update weapon
    const weapon = await prisma.weapon.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Weapon updated successfully",
      weapon,
    });
  } catch (error) {
    console.error("Update weapon error:", error);
    res.status(500).json({ message: "Error updating weapon" });
  }
};

// Delete weapon (admin only)
const deleteWeapon = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    if (permanent === "true") {
      // Hard delete
      await prisma.weapon.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        message: "Weapon permanently deleted",
      });
    } else {
      // Soft delete
      await prisma.weapon.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      res.status(200).json({
        message: "Weapon soft deleted",
      });
    }
  } catch (error) {
    console.error("Delete weapon error:", error);
    res.status(500).json({ message: "Error deleting weapon" });
  }
};

module.exports = {
  getAllWeapons,
  getWeaponById,
  createWeapon,
  updateWeapon,
  deleteWeapon,
};
