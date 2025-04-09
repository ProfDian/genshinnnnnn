const { PrismaClient } = require("@prisma/client");
const ascensionStatService = require("../services/ascensionStatService");
const prisma = new PrismaClient();

/**
 * Mendapatkan semua stat untuk karakter tertentu
 */
const getCharacterStats = async (req, res) => {
  try {
    const { characterId } = req.params;

    const stats = await prisma.characterStat.findMany({
      where: { characterId: parseInt(characterId) },
      orderBy: [{ ascension: "asc" }, { level: "asc" }],
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get character stats error:", error);
    res.status(500).json({ message: "Error fetching character stats" });
  }
};

/**
 * Mendapatkan semua jenis ascension stat yang tersedia
 */
const getStatTypes = async (req, res) => {
  try {
    const statTypes = ascensionStatService.getStatTypes();
    const formattedTypes = Object.keys(statTypes).map((key) => ({
      value: statTypes[key],
      label: key.replace(/_/g, " ").replace(/PERCENT/g, "%"),
    }));

    res.status(200).json(formattedTypes);
  } catch (error) {
    console.error("Get stat types error:", error);
    res.status(500).json({ message: "Error fetching stat types" });
  }
};

/**
 * Menambahkan stats untuk karakter berdasarkan ascension stat type
 */
const addCharacterStats = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { statType, baseStats } = req.body;

    // Validasi input
    if (!statType || !baseStats || !Array.isArray(baseStats)) {
      return res.status(400).json({
        message:
          "Diperlukan statType dan baseStats (array of {level, baseAtk})",
      });
    }

    // Mendapatkan rarity karakter
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
      include: { rarity: true },
    });

    if (!character) {
      return res.status(404).json({ message: "Karakter tidak ditemukan" });
    }

    const rarityValue = character.rarity?.rarityValue;

    if (!rarityValue || (rarityValue !== 4 && rarityValue !== 5)) {
      return res.status(400).json({
        message:
          "Karakter harus memiliki rarity 4 atau 5 untuk ascension stats",
      });
    }

    // Hapus stats lama jika ada
    await prisma.characterStat.deleteMany({
      where: { characterId: parseInt(characterId) },
    });

    // Generate stats baru
    const statsData = ascensionStatService.generateCharacterStats(
      parseInt(characterId),
      statType,
      rarityValue,
      baseStats
    );

    // Simpan ke database
    const createdStats = await prisma.$transaction(
      statsData.map((stat) => prisma.characterStat.create({ data: stat }))
    );

    res.status(201).json({
      message: "Character stats added successfully",
      stats: createdStats,
    });
  } catch (error) {
    console.error("Add character stats error:", error);
    res.status(500).json({
      message: "Error adding character stats",
      error: error.message,
    });
  }
};

/**
 * Memperbarui satu stat karakter
 */
const updateCharacterStat = async (req, res) => {
  try {
    const { statId } = req.params;
    const { baseAtk, statValue } = req.body;

    // Perbarui stat
    const updatedStat = await prisma.characterStat.update({
      where: { id: parseInt(statId) },
      data: {
        baseAtk: baseAtk !== undefined ? parseFloat(baseAtk) : undefined,
        statValue: statValue !== undefined ? parseFloat(statValue) : undefined,
      },
    });

    res.status(200).json({
      message: "Character stat updated successfully",
      stat: updatedStat,
    });
  } catch (error) {
    console.error("Update character stat error:", error);
    res.status(500).json({ message: "Error updating character stat" });
  }
};

/**
 * Mengenerate preview stats karakter berdasarkan statType
 * (Tidak menyimpan ke database, hanya untuk preview)
 */
const previewCharacterStats = async (req, res) => {
  try {
    const { statType, rarityValue, baseStats } = req.body;

    // Validasi input
    if (!statType || !rarityValue || !baseStats) {
      return res.status(400).json({
        message: "Diperlukan statType, rarityValue, dan baseStats",
      });
    }

    // Generate preview stats
    const previewStats = ascensionStatService.generateCharacterStats(
      0, // ID dummy
      statType,
      parseInt(rarityValue),
      baseStats
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

/**
 * Mendapatkan map level ascension
 */
const getLevelAscensionMap = async (req, res) => {
  try {
    const levelMap = ascensionStatService.getLevelAscensionMap();
    res.status(200).json(levelMap);
  } catch (error) {
    console.error("Get level map error:", error);
    res.status(500).json({ message: "Error fetching level map" });
  }
};

module.exports = {
  getCharacterStats,
  getStatTypes,
  addCharacterStats,
  updateCharacterStat,
  previewCharacterStats,
  getLevelAscensionMap,
};
