const { PrismaClient } = require("@prisma/client");
const characterStatService = require("../services/characterStatService");
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
    const statTypes = characterStatService.STAT_TYPES;
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
 * Menambahkan stats untuk karakter berdasarkan stats level 1 dan max ascension values
 */
const addCharacterStats = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { statType, baseStats, maxAscensionValues } = req.body;

    // Validasi input
    if (
      !statType ||
      !baseStats ||
      !baseStats.hp ||
      !baseStats.atk ||
      !baseStats.def
    ) {
      return res.status(400).json({
        message:
          "Diperlukan statType dan baseStats dengan nilai hp, atk, dan def level 1",
      });
    }

    if (
      !maxAscensionValues ||
      !maxAscensionValues.hp ||
      !maxAscensionValues.atk ||
      !maxAscensionValues.def
    ) {
      return res.status(400).json({
        message: "Diperlukan maxAscensionValues dengan nilai hp, atk, dan def",
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

    // Generate stats baru menggunakan service otomatis
    const statsData = characterStatService.generateAllCharacterStats(
      parseInt(characterId),
      statType,
      rarityValue,
      baseStats,
      maxAscensionValues
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
    console.error("Add character stats error details:", error);

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
    const { hp, baseAtk, def, statValue } = req.body;

    // Perbarui stat
    const updatedStat = await prisma.characterStat.update({
      where: { id: parseInt(statId) },
      data: {
        hp: hp !== undefined ? parseFloat(hp) : undefined,
        baseAtk: baseAtk !== undefined ? parseFloat(baseAtk) : undefined,
        def: def !== undefined ? parseFloat(def) : undefined,
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
 * Mengenerate preview stats karakter berdasarkan stats level 1 dan max ascension values
 * (Tidak menyimpan ke database, hanya untuk preview)
 */
const previewCharacterStats = async (req, res) => {
  try {
    const { statType, rarityValue, baseStats, maxAscensionValues } = req.body;

    // Validasi input
    if (
      !statType ||
      !rarityValue ||
      !baseStats ||
      !baseStats.hp ||
      !baseStats.atk ||
      !baseStats.def
    ) {
      return res.status(400).json({
        message:
          "Diperlukan statType, rarityValue, dan baseStats level 1 (hp, atk, def)",
      });
    }

    if (
      !maxAscensionValues ||
      !maxAscensionValues.hp ||
      !maxAscensionValues.atk ||
      !maxAscensionValues.def
    ) {
      return res.status(400).json({
        message: "Diperlukan maxAscensionValues dengan nilai hp, atk, dan def",
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

    const previewStats = previewLevels.map(({ level, ascension }) =>
      characterStatService.generateCharacterStatForLevel(
        0, // ID dummy
        statType,
        parseInt(rarityValue),
        baseStats,
        maxAscensionValues,
        level,
        ascension
      )
    );

    // Tambahkan informasi nilai total untuk tampilan
    const displayStats = previewStats.map((stat) => ({
      ...stat,
      displayStatValue: characterStatService.getTotalStatValueForDisplay(
        stat.statType,
        stat.statValue
      ),
    }));

    res.status(200).json(displayStats);
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
    const levelMap = characterStatService.LEVEL_ASCENSION_MAP;
    res.status(200).json(levelMap);
  } catch (error) {
    console.error("Get level map error:", error);
    res.status(500).json({ message: "Error fetching level map" });
  }
};

/**
 * Mendapatkan nilai base untuk stat bonus (untuk frontend)
 */
const getBaseStatValues = async (req, res) => {
  try {
    const baseValues = characterStatService.BASE_STAT_VALUES;
    res.status(200).json(baseValues);
  } catch (error) {
    console.error("Get base stat values error:", error);
    res.status(500).json({ message: "Error fetching base stat values" });
  }
};

module.exports = {
  getCharacterStats,
  getStatTypes,
  addCharacterStats,
  updateCharacterStat,
  previewCharacterStats,
  getLevelAscensionMap,
  getBaseStatValues,
};
