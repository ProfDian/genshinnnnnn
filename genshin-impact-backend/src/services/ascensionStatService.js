// Definisi jenis-jenis ascension stat
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

// Nilai ascension stat untuk karakter 5 star (sesuai dengan level ascension)
const FIVE_STAR_VALUES = {
  [STAT_TYPES.CRIT_RATE]: [0, 0, 0, 4.8, 9.6, 14.4, 19.2],
  [STAT_TYPES.CRIT_DMG]: [0, 0, 0, 9.6, 19.2, 28.8, 38.4],
  [STAT_TYPES.ATK_PERCENT]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.HP_PERCENT]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.DEF_PERCENT]: [0, 0, 0, 7.5, 15, 22.5, 30],
  [STAT_TYPES.ENERGY_RECHARGE]: [0, 0, 0, 6.7, 13.3, 20, 26.7],
  [STAT_TYPES.ELEMENTAL_MASTERY]: [0, 0, 0, 28.8, 57.6, 86.4, 115.2],
  [STAT_TYPES.HEALING_BONUS]: [0, 0, 0, 5.5, 11.1, 16.6, 22.2],
  [STAT_TYPES.PHYSICAL_DMG]: [0, 0, 0, 7.5, 15, 22.5, 30],
  [STAT_TYPES.PYRO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.HYDRO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.CRYO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.ELECTRO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.ANEMO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.GEO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
  [STAT_TYPES.DENDRO_DMG]: [0, 0, 0, 7.2, 14.4, 21.6, 28.8],
};

// Nilai ascension stat untuk karakter 4 star (sesuai dengan level ascension)
const FOUR_STAR_VALUES = {
  [STAT_TYPES.CRIT_RATE]: [0, 0, 0, 4, 8, 12, 16],
  [STAT_TYPES.CRIT_DMG]: [0, 0, 0, 8, 16, 24, 32],
  [STAT_TYPES.ATK_PERCENT]: [0, 0, 0, 5, 10, 15, 20],
  [STAT_TYPES.HP_PERCENT]: [0, 0, 0, 5, 10, 15, 20],
  [STAT_TYPES.DEF_PERCENT]: [0, 0, 0, 6.3, 12.5, 18.8, 25],
  [STAT_TYPES.ENERGY_RECHARGE]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.ELEMENTAL_MASTERY]: [0, 0, 0, 24, 48, 72, 96],
  [STAT_TYPES.HEALING_BONUS]: [0, 0, 0, 4.5, 9, 13.5, 18],
  [STAT_TYPES.PHYSICAL_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.PYRO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.HYDRO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.CRYO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.ELECTRO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.ANEMO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.GEO_DMG]: [0, 0, 0, 6, 12, 18, 24],
  [STAT_TYPES.DENDRO_DMG]: [0, 0, 0, 6, 12, 18, 24],
};

// Definisi level dan ascension
const LEVEL_ASCENSION_MAP = [
  { level: 1, ascension: 0 },
  { level: 20, ascension: 0 },
  { level: 40, ascension: 1 },
  { level: 50, ascension: 2 },
  { level: 60, ascension: 3 },
  { level: 70, ascension: 4 },
  { level: 80, ascension: 5 },
  { level: 90, ascension: 6 },
];

/**
 * Mendapatkan nilai ascension stat berdasarkan jenis stat, rarity, dan level ascension
 * @param {string} statType - Jenis stat (dari STAT_TYPES)
 * @param {number} rarityValue - Nilai rarity karakter (4 atau 5)
 * @param {number} ascension - Level ascension (0-6)
 * @returns {number} Nilai ascension stat
 */
function getAscensionStatValue(statType, rarityValue, ascension) {
  // Validasi input
  if (!STAT_TYPES[statType]) {
    throw new Error(`Stat type ${statType} tidak valid`);
  }

  if (rarityValue !== 4 && rarityValue !== 5) {
    throw new Error(
      `Rarity ${rarityValue} tidak didukung untuk ascension stats`
    );
  }

  if (ascension < 0 || ascension > 6) {
    throw new Error(`Ascension level ${ascension} tidak valid (harus 0-6)`);
  }

  // Pilih nilai berdasarkan rarity
  const values = rarityValue === 5 ? FIVE_STAR_VALUES : FOUR_STAR_VALUES;

  // Kembalikan nilai yang sesuai
  return values[statType][ascension];
}

/**
 * Membuat daftar character stats untuk karakter baru berdasarkan jenis ascension stat
 * @param {number} characterId - ID karakter
 * @param {string} statType - Jenis stat ascension (dari STAT_TYPES)
 * @param {number} rarityValue - Nilai rarity karakter (4 atau 5)
 * @param {Object[]} baseStats - Array nilai base ATK per level [{level, baseAtk}]
 * @returns {Object[]} Array objek character stats untuk dibuat di database
 */
function generateCharacterStats(characterId, statType, rarityValue, baseStats) {
  // Validasi input
  if (!baseStats || !Array.isArray(baseStats) || baseStats.length === 0) {
    throw new Error("Base stats harus berupa array dengan nilai baseAtk");
  }

  // Pastikan ada nilai base ATK untuk semua level yang dibutuhkan
  const requiredLevels = LEVEL_ASCENSION_MAP.map((item) => item.level);
  const providedLevels = baseStats.map((item) => item.level);

  const missingLevels = requiredLevels.filter(
    (level) => !providedLevels.includes(level)
  );
  if (missingLevels.length > 0) {
    throw new Error(
      `Base stats tidak lengkap. Level yang kurang: ${missingLevels.join(", ")}`
    );
  }

  // Buat stats untuk setiap level
  return LEVEL_ASCENSION_MAP.map(({ level, ascension }) => {
    // Cari base ATK yang sesuai
    const baseStat = baseStats.find((stat) => stat.level === level);

    return {
      characterId,
      ascension,
      level,
      baseAtk: baseStat.baseAtk,
      statType,
      statValue: getAscensionStatValue(statType, rarityValue, ascension),
    };
  });
}

/**
 * Mendapatkan daftar semua jenis ascension stat yang tersedia
 * @returns {Object} Objek dengan key dan nilai STAT_TYPES
 */
function getStatTypes() {
  return STAT_TYPES;
}

/**
 * Mendapatkan daftar map level dan ascension
 * @returns {Object[]} Array objek dengan level dan ascension
 */
function getLevelAscensionMap() {
  return LEVEL_ASCENSION_MAP;
}

module.exports = {
  STAT_TYPES,
  getAscensionStatValue,
  generateCharacterStats,
  getStatTypes,
  getLevelAscensionMap,
};
