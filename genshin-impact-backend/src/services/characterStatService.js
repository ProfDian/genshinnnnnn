// Character Stat Service - otomatisasi perhitungan stats
// Berdasarkan rumus: Stat Value = Base Value × Level Multiplier + Ascension Value
// dimana Ascension Value = Max Ascension Value × Ascension Multiplier

// Jenis-jenis stat bonus
const STAT_TYPES = {
  CRIT_RATE: "CRIT_RATE",
  CRIT_DMG: "CRIT_DMG",
  ATK_PERCENT: "ATK_PERCENT",
  HP_PERCENT: "HP_PERCENT",
  DEF_PERCENT: "DEF_PERCENT",
  ENERGY_RECHARGE: "ENERGY_RECHARGE",
  ELEMENTAL_MASTERY: "ELEMENTAL_MASTERY",
  HEALING_BONUS: "HEALING_BONUS",
  PHYSICAL_DMG: "PHYSICAL_DMG",
  PYRO_DMG: "PYRO_DMG",
  HYDRO_DMG: "HYDRO_DMG",
  CRYO_DMG: "CRYO_DMG",
  ELECTRO_DMG: "ELECTRO_DMG",
  ANEMO_DMG: "ANEMO_DMG",
  GEO_DMG: "GEO_DMG",
  DENDRO_DMG: "DENDRO_DMG",
};

// Nilai dasar untuk stats tertentu
const BASE_STAT_VALUES = {
  CRIT_RATE: 5.0, // 5%
  CRIT_DMG: 50.0, // 50%
  ENERGY_RECHARGE: 100.0, // 100%
};

// Level dan ascension phase
const LEVEL_ASCENSION_MAP = [
  { level: 1, ascension: 0 },
  { level: 20, ascension: 0 },
  { level: 20, ascension: 1 }, // Setelah ascension pertama
  { level: 40, ascension: 1 },
  { level: 40, ascension: 2 }, // Setelah ascension kedua
  { level: 50, ascension: 2 },
  { level: 50, ascension: 3 }, // Setelah ascension ketiga
  { level: 60, ascension: 3 },
  { level: 60, ascension: 4 }, // Setelah ascension keempat
  { level: 70, ascension: 4 },
  { level: 70, ascension: 5 }, // Setelah ascension kelima
  { level: 80, ascension: 5 },
  { level: 80, ascension: 6 }, // Setelah ascension keenam
  { level: 90, ascension: 6 },
];

// Multiplier berdasarkan level untuk 4* dan 5*
const getLevelMultiplier = (level, rarity) => {
  // Base multiplier calculation
  const baseMultiplier = 1 + ((9.17431 - 1) / (100 - 1)) * (level - 1);

  if (rarity === 4) {
    // Round to 3 decimal places for 4-star characters
    return Math.round(baseMultiplier * 1000) / 1000;
  } else if (rarity === 5) {
    // 5-star character formula with correction factor
    const correction =
      -0.00168 + 0.0000748163 * Math.pow(0.761486 * (5.11365 + level), 2);
    return Math.round((baseMultiplier + correction) * 1000) / 1000;
  }

  // Default fallback to base multiplier if rarity unknown
  return baseMultiplier;
};

// Ascension multiplier untuk base stats (HP, ATK, DEF)
const getBaseStatAscensionMultiplier = (ascension) => {
  const multipliers = [
    0,
    38 / 182,
    65 / 182,
    101 / 182,
    128 / 182,
    155 / 182,
    182 / 182,
  ];
  return multipliers[ascension] || 0;
};

// Ascension multiplier untuk bonus stats (CRIT, DMG Bonus, dll)
const getBonusStatAscensionMultiplier = (ascension) => {
  const multipliers = [0, 0, 1, 2, 2, 3, 4];
  return multipliers[ascension] || 0;
};

// Base value untuk bonus stats berdasarkan jenis dan rarity
const getBonusStatBaseValue = (statType, rarity) => {
  if (rarity === 5) {
    switch (statType) {
      case STAT_TYPES.CRIT_RATE:
        return 4.8;
      case STAT_TYPES.CRIT_DMG:
        return 9.6;
      case STAT_TYPES.ATK_PERCENT:
      case STAT_TYPES.HP_PERCENT:
        return 7.2;
      case STAT_TYPES.DEF_PERCENT:
      case STAT_TYPES.PHYSICAL_DMG:
        return 9.0;
      case STAT_TYPES.PYRO_DMG:
      case STAT_TYPES.HYDRO_DMG:
      case STAT_TYPES.CRYO_DMG:
      case STAT_TYPES.ELECTRO_DMG:
      case STAT_TYPES.ANEMO_DMG:
      case STAT_TYPES.GEO_DMG:
      case STAT_TYPES.DENDRO_DMG:
        return 7.2;
      case STAT_TYPES.ENERGY_RECHARGE:
        return 8.0;
      case STAT_TYPES.ELEMENTAL_MASTERY:
        return 28.8;
      case STAT_TYPES.HEALING_BONUS:
        return 5.5;
      default:
        return 0;
    }
  } else if (rarity === 4) {
    switch (statType) {
      case STAT_TYPES.CRIT_RATE:
        return 4.0;
      case STAT_TYPES.CRIT_DMG:
        return 8.0;
      case STAT_TYPES.ATK_PERCENT:
      case STAT_TYPES.HP_PERCENT:
        return 6.0;
      case STAT_TYPES.DEF_PERCENT:
      case STAT_TYPES.PHYSICAL_DMG:
        return 7.5;
      case STAT_TYPES.PYRO_DMG:
      case STAT_TYPES.HYDRO_DMG:
      case STAT_TYPES.CRYO_DMG:
      case STAT_TYPES.ELECTRO_DMG:
      case STAT_TYPES.ANEMO_DMG:
      case STAT_TYPES.GEO_DMG:
      case STAT_TYPES.DENDRO_DMG:
        return 6.0;
      case STAT_TYPES.ENERGY_RECHARGE:
        return 6.7;
      case STAT_TYPES.ELEMENTAL_MASTERY:
        return 24.0;
      default:
        return 0;
    }
  }

  return 0;
};

/**
 * Menghitung stats karakter (HP, ATK, DEF) pada level dan ascension tertentu
 * @param {Object} baseStats - Stats karakter pada level 1 (HP, ATK, DEF)
 * @param {number} rarity - Raritas karakter (4 atau 5)
 * @param {Object} maxAscensionValues - Nilai maksimum stat saat ascension 6
 * @param {number} level - Level karakter
 * @param {number} ascension - Ascension phase (0-6)
 * @returns {Object} - Nilai HP, ATK, DEF pada level dan ascension tersebut
 */
function calculateCharacterStats(
  baseStats,
  rarity,
  maxAscensionValues,
  level,
  ascension
) {
  const levelMultiplier = getLevelMultiplier(level, rarity);
  const ascensionMultiplier = getBaseStatAscensionMultiplier(ascension);

  const hp =
    baseStats.hp * levelMultiplier +
    maxAscensionValues.hp * ascensionMultiplier;
  const atk =
    baseStats.atk * levelMultiplier +
    maxAscensionValues.atk * ascensionMultiplier;
  const def =
    baseStats.def * levelMultiplier +
    maxAscensionValues.def * ascensionMultiplier;

  return {
    hp: Math.round(hp * 10) / 10, // Round to 1 decimal place
    atk: Math.round(atk * 10) / 10, // Round to 1 decimal place
    def: Math.round(def * 10) / 10, // Round to 1 decimal place
  };
}

/**
 * Menghitung stat bonus karakter pada ascension tertentu
 * @param {string} statType - Jenis stat bonus (dari STAT_TYPES)
 * @param {number} rarity - Raritas karakter (4 atau 5)
 * @param {number} ascension - Ascension phase (0-6)
 * @returns {number} - Nilai stat bonus pada ascension tersebut (tanpa nilai dasar)
 */
function calculateBonusStat(statType, rarity, ascension) {
  const baseValue = getBonusStatBaseValue(statType, rarity);
  const multiplier = getBonusStatAscensionMultiplier(ascension);

  // Hanya return nilai bonus dari ascension, tanpa nilai dasar
  return Math.round(baseValue * multiplier * 10) / 10; // Round to 1 decimal place
}

/**
 * Generate semua stats karakter dari level 1-90 berdasarkan stats level 1 dan max ascension values
 * @param {number} characterId - ID karakter
 * @param {string} statType - Jenis stat bonus (dari STAT_TYPES)
 * @param {number} rarity - Raritas karakter (4 atau 5)
 * @param {Object} baseStats - Stats karakter pada level 1 (hp, atk, def)
 * @param {Object} maxAscensionValues - Nilai maksimum saat ascension 6 (hp, atk, def)
 * @returns {Array} Array objek stats untuk setiap level dan ascension
 */
function generateAllCharacterStats(
  characterId,
  statType,
  rarity,
  baseStats,
  maxAscensionValues
) {
  if (!baseStats || !baseStats.hp || !baseStats.atk || !baseStats.def) {
    throw new Error("Base stats (HP, ATK, DEF) diperlukan untuk level 1");
  }

  if (
    !maxAscensionValues ||
    !maxAscensionValues.hp ||
    !maxAscensionValues.atk ||
    !maxAscensionValues.def
  ) {
    throw new Error("Max ascension values (HP, ATK, DEF) diperlukan");
  }

  if (rarity !== 4 && rarity !== 5) {
    throw new Error("Rarity harus 4 atau 5");
  }

  // Generate stats untuk setiap kombinasi level dan ascension
  const allStats = [];

  LEVEL_ASCENSION_MAP.forEach(({ level, ascension }) => {
    // Hitung stats dasar
    const stats = calculateCharacterStats(
      baseStats,
      rarity,
      maxAscensionValues,
      level,
      ascension
    );

    // Hitung stat bonus
    const bonusStatValue = calculateBonusStat(statType, rarity, ascension);

    // Buat objek stat untuk database
    allStats.push({
      characterId,
      level,
      ascension,
      hp: stats.hp,
      baseAtk: stats.atk,
      def: stats.def,
      statType,
      statValue: bonusStatValue,
    });
  });

  return allStats;
}

/**
 * Generate stats karakter pada level dan ascension tertentu
 * @param {number} characterId - ID karakter
 * @param {string} statType - Jenis stat bonus (dari STAT_TYPES)
 * @param {number} rarity - Raritas karakter (4 atau 5)
 * @param {Object} baseStats - Stats karakter pada level 1 {hp, atk, def}
 * @param {Object} maxAscensionValues - Nilai maksimum saat ascension 6 {hp, atk, def}
 * @param {number} level - Level karakter yang diinginkan
 * @param {number} ascension - Ascension phase yang diinginkan
 * @returns {Object} Objek stats untuk level dan ascension tersebut
 */
function generateCharacterStatForLevel(
  characterId,
  statType,
  rarity,
  baseStats,
  maxAscensionValues,
  level,
  ascension
) {
  if (!baseStats || !baseStats.hp || !baseStats.atk || !baseStats.def) {
    throw new Error("Base stats (HP, ATK, DEF) diperlukan untuk level 1");
  }

  if (
    !maxAscensionValues ||
    !maxAscensionValues.hp ||
    !maxAscensionValues.atk ||
    !maxAscensionValues.def
  ) {
    throw new Error("Max ascension values (HP, ATK, DEF) diperlukan");
  }

  if (rarity !== 4 && rarity !== 5) {
    throw new Error("Rarity harus 4 atau 5");
  }

  // Hitung stats dasar
  const stats = calculateCharacterStats(
    baseStats,
    rarity,
    maxAscensionValues,
    level,
    ascension
  );

  // Hitung stat bonus
  const bonusStatValue = calculateBonusStat(statType, rarity, ascension);

  // Buat objek stat
  return {
    characterId,
    level,
    ascension,
    hp: stats.hp,
    baseAtk: stats.atk,
    def: stats.def,
    statType,
    statValue: bonusStatValue,
  };
}

/**
 * Mendapatkan nilai total stat (termasuk nilai dasar) untuk tampilan
 * @param {string} statType - Jenis stat bonus (dari STAT_TYPES)
 * @param {number} bonusValue - Nilai bonus dari ascension
 * @returns {number} - Nilai total stat untuk tampilan
 */
function getTotalStatValueForDisplay(statType, bonusValue) {
  // Tambahkan nilai dasar jika statType memiliki nilai dasar
  if (statType in BASE_STAT_VALUES) {
    return BASE_STAT_VALUES[statType] + bonusValue;
  }
  return bonusValue;
}

module.exports = {
  STAT_TYPES,
  BASE_STAT_VALUES,
  LEVEL_ASCENSION_MAP,
  calculateCharacterStats,
  calculateBonusStat,
  generateAllCharacterStats,
  generateCharacterStatForLevel,
  getLevelMultiplier,
  getBaseStatAscensionMultiplier,
  getBonusStatAscensionMultiplier,
  getBonusStatBaseValue,
  getTotalStatValueForDisplay,
};
