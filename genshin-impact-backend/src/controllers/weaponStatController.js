const { PrismaClient } = require("@prisma/client");
const weaponStatService = require("../services/weaponStatService");
const prisma = new PrismaClient();

/**
 * Mendapatkan semua stat untuk senjata tertentu
 */
const getWeaponStats = async (req, res) => {
  try {
    const { weaponId } = req.params;

    const stats = await prisma.weaponStat.findMany({
      where: {
        weapon_id: parseInt(weaponId), // Ubah weaponId menjadi weapon_id
      },
      orderBy: [{ ascension: "asc" }, { level: "asc" }],
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get weapon stats error:", error);
    res.status(500).json({ message: "Error fetching weapon stats" });
  }
};

/**
 * Mendapatkan semua jenis weapon types yang tersedia
 */
const getWeaponTypes = async (req, res) => {
  try {
    const weaponTypes = weaponStatService.WEAPON_BASE_TYPES;
    const formattedTypes = Object.keys(weaponTypes).map((key) => ({
      value: key,
      label: key.replace(/_/g, " "),
      baseATK: weaponTypes[key].baseATK,
      rarity: weaponTypes[key].rarity,
      tier: weaponTypes[key].tier,
    }));

    res.status(200).json(formattedTypes);
  } catch (error) {
    console.error("Get weapon types error:", error);
    res.status(500).json({ message: "Error fetching weapon types" });
  }
};

/**
 * Mendapatkan semua jenis substat yang tersedia
 */
const getSubstatTypes = async (req, res) => {
  try {
    const substatTypes = weaponStatService.SUBSTAT_TYPES;
    const formattedTypes = Object.keys(substatTypes).map((key) => ({
      value: substatTypes[key],
      label: key.replace(/_/g, " ").replace(/PERCENT/g, "%"),
    }));

    res.status(200).json(formattedTypes);
  } catch (error) {
    console.error("Get substat types error:", error);
    res.status(500).json({ message: "Error fetching substat types" });
  }
};

/**
 * Menambahkan stats untuk senjata
 */
const addWeaponStats = async (req, res) => {
  try {
    const { weaponId } = req.params;
    const { weaponType, substatValue, substatType } = req.body;

    // Validasi input
    if (!weaponType) {
      return res.status(400).json({
        message: "Weapon type diperlukan untuk menghitung stats",
      });
    }

    // Cek apakah senjata ada
    const weapon = await prisma.weapon.findUnique({
      where: { id: parseInt(weaponId) },
    });

    if (!weapon) {
      return res.status(404).json({ message: "Senjata tidak ditemukan" });
    }

    // Hapus stats lama jika ada
    await prisma.weaponStat.deleteMany({
      where: { weaponId: parseInt(weaponId) },
    });

    // Generate stats baru
    const statsData = weaponStatService.generateAllWeaponStats(
      parseInt(weaponId),
      weaponType,
      substatValue ? parseFloat(substatValue) : null,
      substatType
    );

    // Simpan ke database
    const createdStats = await prisma.$transaction(
      statsData.map((stat) => prisma.weaponStat.create({ data: stat }))
    );

    res.status(201).json({
      message: "Weapon stats added successfully",
      stats: createdStats,
    });
  } catch (error) {
    console.error("Add weapon stats error:", error);
    res.status(500).json({
      message: "Error adding weapon stats",
      error: error.message,
    });
  }
};

/**
 * Memperbarui satu stat senjata
 */
const updateWeaponStat = async (req, res) => {
  try {
    const { statId } = req.params;
    const { baseATK, substatValue } = req.body;

    // Perbarui stat
    const updatedStat = await prisma.weaponStat.update({
      where: { id: parseInt(statId) },
      data: {
        baseATK: baseATK !== undefined ? parseInt(baseATK) : undefined,
        substatValue:
          substatValue !== undefined ? parseFloat(substatValue) : undefined,
      },
    });

    res.status(200).json({
      message: "Weapon stat updated successfully",
      stat: updatedStat,
    });
  } catch (error) {
    console.error("Update weapon stat error:", error);
    res.status(500).json({ message: "Error updating weapon stat" });
  }
};

/**
 * Mengenerate preview stats senjata (tidak menyimpan ke database)
 */
const previewWeaponStats = async (req, res) => {
  try {
    const { weaponType, substatValue, substatType } = req.body;

    // Validasi input
    if (!weaponType) {
      return res.status(400).json({
        message: "Weapon type diperlukan untuk preview stats",
      });
    }

    // Generate preview stats untuk beberapa level penting
    const previewLevels = [
      { level: 1, ascension: 0 },
      { level: 20, ascension: 0 },
      { level: 20, ascension: 1 },
      { level: 40, ascension: 1 },
      { level: 40, ascension: 2 },
      { level: 50, ascension: 2 },
      { level: 50, ascension: 3 },
      { level: 60, ascension: 3 },
      { level: 60, ascension: 4 },
      { level: 70, ascension: 4 },
      { level: 70, ascension: 5 },
      { level: 80, ascension: 5 },
      { level: 80, ascension: 6 },
      { level: 90, ascension: 6 },
    ];

    const weaponBaseInfo = weaponStatService.WEAPON_BASE_TYPES[weaponType];

    // Filter level maksimal berdasarkan raritas
    const filteredLevels = previewLevels.filter(({ level }) => {
      if (weaponBaseInfo.rarity <= 2) return level <= 70;
      return true;
    });

    const previewStats = filteredLevels.map(({ level, ascension }) =>
      weaponStatService.generateWeaponStatForLevel(
        0, // ID dummy
        weaponType,
        substatValue ? parseFloat(substatValue) : null,
        substatType,
        level,
        ascension
      )
    );

    res.status(200).json(previewStats);
  } catch (error) {
    console.error("Preview stats error:", error);
    res.status(500).json({
      message: "Error generating preview stats",
      error: error.message,
    });
  }
};

module.exports = {
  getWeaponStats,
  getWeaponTypes,
  getSubstatTypes,
  addWeaponStats,
  updateWeaponStat,
  previewWeaponStats,
};
