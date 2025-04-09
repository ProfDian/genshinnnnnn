const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all weapons
const getAllWeapons = async (req, res) => {
  try {
    const weapons = await prisma.weaponDetailsView.findMany();

    res.status(200).json(weapons);
  } catch (error) {
    console.error("Get weapons error:", error);
    res.status(500).json({ message: "Error fetching weapons" });
  }
};

// Get weapon by ID
const getWeaponById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get weapon details from view
    const weapon = await prisma.weaponDetailsView.findUnique({
      where: { weaponId: parseInt(id) },
    });

    if (!weapon) {
      return res.status(404).json({ message: "Weapon not found" });
    }

    // Get additional weapon data
    const weaponData = await prisma.weapon.findUnique({
      where: { id: parseInt(id) },
      include: {
        stats: true,
        passives: true,
        refinements: true,
      },
    });

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

    res.status(200).json({
      ...weapon,
      stats: weaponData.stats,
      passives: weaponData.passives,
      refinements: weaponData.refinements,
      story: weaponData.story,
    });
  } catch (error) {
    console.error("Get weapon error:", error);
    res.status(500).json({ message: "Error fetching weapon" });
  }
};

// Create weapon (admin only)
const createWeapon = async (req, res) => {
  try {
    const {
      name,
      description,
      weaponTypeId,
      rarityId,
      specialProperty,
      story,
    } = req.body;

    // Get file URL if uploaded
    const icon = req.file ? req.file.path : null;

    // Create weapon
    const weapon = await prisma.weapon.create({
      data: {
        name,
        description,
        weaponTypeId: parseInt(weaponTypeId),
        rarityId: parseInt(rarityId),
        specialProperty,
        icon,
        story,
      },
    });

    res.status(201).json({
      message: "Weapon created successfully",
      weapon,
    });
  } catch (error) {
    console.error("Create weapon error:", error);
    res.status(500).json({ message: "Error creating weapon" });
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
