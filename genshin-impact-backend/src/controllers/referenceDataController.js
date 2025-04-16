// controllers/referenceDataController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Mengambil semua data elemen
const getAllElements = async (req, res) => {
  try {
    const elements = await prisma.element.findMany();
    res.json(elements);
  } catch (error) {
    console.error("Error getting elements:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mengambil semua data weapon types
const getAllWeaponTypes = async (req, res) => {
  try {
    const weaponTypes = await prisma.weaponType.findMany();
    res.json(weaponTypes);
  } catch (error) {
    console.error("Error getting weapon types:", error);
    res.status(500).json({ error: error.message });
  }
};

// Mengambil semua data rarities
const getAllRarities = async (req, res) => {
  try {
    const rarities = await prisma.rarity.findMany({
      orderBy: {
        rarityValue: "asc",
      },
    });
    res.json(rarities);
  } catch (error) {
    console.error("Error getting rarities:", error);
    res.status(500).json({ error: error.message });
  }
};

// Filter karakter berdasarkan parameter
const getFilteredCharacters = async (req, res) => {
  try {
    const { elementId, weaponTypeId, rarityId, name } = req.query;

    const whereClause = {
      deletedAt: null, // Hanya karakter yang tidak dihapus
    };

    if (elementId) whereClause.elementId = parseInt(elementId);
    if (weaponTypeId) whereClause.weaponTypeId = parseInt(weaponTypeId);
    if (rarityId) whereClause.rarityId = parseInt(rarityId);
    if (name) whereClause.name = { contains: name };

    const characters = await prisma.character.findMany({
      where: whereClause,
      include: {
        element: true,
        weaponType: true,
        region: true,
        rarity: true,
      },
    });

    res.json(characters);
  } catch (error) {
    console.error("Error filtering characters:", error);
    res.status(500).json({ error: error.message });
  }
};

// Filter senjata berdasarkan parameter
const getFilteredWeapons = async (req, res) => {
  try {
    const { weaponTypeId, rarityId, name } = req.query;

    const whereClause = {
      deletedAt: null, // Hanya senjata yang tidak dihapus
    };

    if (weaponTypeId) whereClause.weaponTypeId = parseInt(weaponTypeId);
    if (rarityId) whereClause.rarityId = parseInt(rarityId);
    if (name) whereClause.name = { contains: name };

    const weapons = await prisma.weapon.findMany({
      where: whereClause,
      include: {
        weaponType: true,
        rarity: true,
      },
    });

    res.json(weapons);
  } catch (error) {
    console.error("Error filtering weapons:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllElements,
  getAllWeaponTypes,
  getAllRarities,
  getFilteredCharacters,
  getFilteredWeapons,
};
