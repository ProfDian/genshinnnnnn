// Weapon Stat Service - otomatisasi perhitungan stats weapon
// Berdasarkan rumus:
// Base ATK Value = Base Value * Level Multiplier + Ascension Value
// Secondary Attribute Value = Base Value * Level Multiplier

// Tipe-tipe senjata berdasarkan Base ATK Level 1
const WEAPON_BASE_TYPES = {
  // 5-Star weapons
  TYPE_49: { rarity: 5, baseATK: 49.1377, tier: 4 }, // Example: Engulfing Lightning
  TYPE_48: { rarity: 5, baseATK: 47.537, tier: 3 }, // Example: Wolf's Gravestone
  TYPE_46: { rarity: 5, baseATK: 45.9364, tier: 2 }, // Example: Staff of Homa
  TYPE_44B: { rarity: 5, baseATK: 44.3358, tier: 1 }, // Example: A Thousand Floating Dreams

  // 4-Star weapons
  TYPE_45: { rarity: 4, baseATK: 45.0687, tier: 4 }, // Example: Prototype Archaic
  TYPE_44: { rarity: 4, baseATK: 43.7349, tier: 3 }, // Example: The Widsith
  TYPE_42: { rarity: 4, baseATK: 42.401, tier: 2 }, // Example: Favonius Sword
  TYPE_41: { rarity: 4, baseATK: 41.0671, tier: 1 }, // Example: Sacrificial Bow
  TYPE_39B: { rarity: 4, baseATK: 39, tier: 1 }, // Special 4-star weapon (like Sword of Descension)

  // 3-Star weapons
  TYPE_40: { rarity: 3, baseATK: 39.8751, tier: 3 }, // Example: Thrilling Tales
  TYPE_39: { rarity: 3, baseATK: 38.7413, tier: 2 }, // Example: Black Tassel
  TYPE_38: { rarity: 3, baseATK: 37.6075, tier: 1 }, // Example: Cool Steel

  // 2-Star weapons
  TYPE_33: { rarity: 2, baseATK: 32.93, tier: 2 }, // Example: Silver Sword

  // 1-Star weapons
  TYPE_23: { rarity: 1, baseATK: 23.245, tier: 2 }, // Example: Dull Blade
};

// Tipe-tipe substat
const SUBSTAT_TYPES = {
  ATK_PERCENT: "ATK_PERCENT",
  DEF_PERCENT: "DEF_PERCENT",
  HP_PERCENT: "HP_PERCENT",
  CRIT_RATE: "CRIT_RATE",
  CRIT_DMG: "CRIT_DMG",
  ELEMENTAL_MASTERY: "ELEMENTAL_MASTERY",
  ENERGY_RECHARGE: "ENERGY_RECHARGE",
  PHYSICAL_DMG_BONUS: "PHYSICAL_DMG_BONUS",
};

// Level ascension map untuk senjata
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

// Ascension values berdasarkan raritas
const ASCENSION_VALUES = {
  1: [0, 11.7, 23.3, 35.0, 46.7, null, null], // 1-Star: indeks 0-6 untuk ascension 0-6
  2: [0, 11.7, 23.3, 35.0, 46.7, null, null], // 2-Star: indeks 0-6 untuk ascension 0-6
  3: [0, 19.5, 38.9, 58.4, 77.8, 97.3, 116.7], // 3-Star
  4: [0, 25.9, 51.9, 77.8, 103.7, 129.7, 155.6], // 4-Star
  5: [0, 31.1, 62.2, 93.4, 124.5, 155.6, 186.7], // 5-Star
};

// Level multiplier untuk Base ATK
const getBaseATKLevelMultiplier = (rarity, tier, level) => {
  // Table of level multipliers for 1-3 Star weapons
  const LEVEL_MULTIPLIER_1_3_STAR = {
    1: { 1: 1, 2: 1, 3: 1 },
    2: { 1: 1.071, 2: 1.076, 3: 1.081 },
    3: { 1: 1.141, 2: 1.152, 3: 1.162 },
    5: { 1: 1.28, 2: 1.303, 3: 1.325 },
    10: { 1: 1.621, 2: 1.679, 3: 1.734 },
    15: { 1: 1.952, 2: 2.051, 3: 2.145 },
    20: { 1: 2.275, 2: 2.42, 3: 2.557 },
    25: { 1: 2.591, 2: 2.786, 3: 2.969 },
    30: { 1: 2.901, 2: 3.148, 3: 3.382 },
    35: { 1: 3.205, 2: 3.508, 3: 3.794 },
    40: { 1: 3.504, 2: 3.866, 3: 4.206 },
    45: { 1: 3.799, 2: 4.221, 3: 4.618 },
    50: { 1: 4.09, 2: 4.574, 3: 5.03 },
    55: { 1: 4.377, 2: 4.925, 3: 5.441 },
    60: { 1: 4.661, 2: 5.274, 3: 5.852 },
    65: { 1: 4.943, 2: 5.622, 3: 6.262 },
    70: { 1: 5.222, 2: 5.968, 3: 6.673 },
    75: { 1: 5.498, 2: 6.314, 3: 7.083 },
    80: { 1: 5.774, 2: 6.659, 3: 7.493 },
    85: { 1: 6.047, 2: 7.003, 3: 7.904 },
    90: { 1: 6.32, 2: 7.346, 3: 8.314 },
  };

  // Table of level multipliers for 4 Star weapons
  const LEVEL_MULTIPLIER_4_STAR = {
    1: { 1: 1, 2: 1, 3: 1, 4: 1 },
    5: { 1: 1.306, 2: 1.33, 3: 1.353, 4: 1.374 },
    10: { 1: 1.682, 2: 1.743, 3: 1.8, 4: 1.854 },
    15: { 1: 2.052, 2: 2.156, 3: 2.253, 4: 2.345 },
    20: { 1: 2.417, 2: 2.569, 3: 2.711, 4: 2.845 },
    25: { 1: 2.778, 2: 2.982, 3: 3.172, 4: 3.352 },
    30: { 1: 3.136, 2: 3.394, 3: 3.637, 4: 3.866 },
    35: { 1: 3.49, 2: 3.807, 3: 4.105, 4: 4.385 },
    40: { 1: 3.842, 2: 4.22, 3: 4.575, 4: 4.909 },
    45: { 1: 4.192, 2: 4.633, 3: 5.047, 4: 5.436 },
    50: { 1: 4.54, 2: 5.046, 3: 5.521, 4: 5.968 },
    55: { 1: 4.886, 2: 5.459, 3: 5.996, 4: 6.502 },
    60: { 1: 5.231, 2: 5.872, 3: 6.473, 4: 7.039 },
    65: { 1: 5.574, 2: 6.284, 3: 6.951, 4: 7.579 },
    70: { 1: 5.916, 2: 6.697, 3: 7.431, 4: 8.12 },
    75: { 1: 6.257, 2: 7.11, 3: 7.911, 4: 8.664 },
    80: { 1: 6.598, 2: 7.523, 3: 8.392, 4: 9.209 },
    85: { 1: 6.937, 2: 7.936, 3: 8.874, 4: 9.756 },
    90: { 1: 7.275, 2: 8.349, 3: 9.356, 4: 10.305 },
  };

  // Table of level multipliers for 5 Star weapons
  const LEVEL_MULTIPLIER_5_STAR = {
    1: { 1: 1, 2: 1, 3: 1, 4: 1 },
    5: { 1: 1.317, 2: 1.343, 3: 1.368, 4: 1.391 },
    10: { 1: 1.709, 2: 1.775, 3: 1.837, 4: 1.895 },
    15: { 1: 2.098, 2: 2.211, 3: 2.317, 4: 2.415 },
    20: { 1: 2.485, 2: 2.65, 3: 2.804, 4: 2.949 },
    25: { 1: 2.871, 2: 3.093, 3: 3.3, 4: 3.493 },
    30: { 1: 3.257, 2: 3.539, 3: 3.803, 4: 4.049 },
    35: { 1: 3.644, 2: 3.989, 3: 4.312, 4: 4.613 },
    40: { 1: 4.031, 2: 4.443, 3: 4.827, 4: 5.186 },
    45: { 1: 4.419, 2: 4.9, 3: 5.348, 4: 5.767 },
    50: { 1: 4.81, 2: 5.36, 3: 5.874, 4: 6.354 },
    55: { 1: 5.201, 2: 5.825, 3: 6.406, 4: 6.949 },
    60: { 1: 5.595, 2: 6.292, 3: 6.942, 4: 7.55 },
    65: { 1: 5.991, 2: 6.763, 3: 7.484, 4: 8.157 },
    70: { 1: 6.39, 2: 7.238, 3: 8.03, 4: 8.77 },
    75: { 1: 6.791, 2: 7.717, 3: 8.58, 4: 9.387 },
    80: { 1: 7.194, 2: 8.199, 3: 9.135, 4: 10.011 },
    85: { 1: 7.601, 2: 8.684, 3: 9.694, 4: 10.639 },
    90: { 1: 8.01, 2: 9.173, 3: 10.258, 4: 11.272 },
  };

  // Special case for type-39b (4-star weapon that uses 3-star scaling)
  if (rarity === 4 && tier === 1 && baseATK === 39) {
    rarity = 3;
    tier = 2;
  }

  // Mendapatkan multiplier berdasarkan rarity dan tier
  let multiplierTable;
  if (rarity <= 3) {
    multiplierTable = LEVEL_MULTIPLIER_1_3_STAR;
  } else if (rarity === 4) {
    multiplierTable = LEVEL_MULTIPLIER_4_STAR;
  } else {
    multiplierTable = LEVEL_MULTIPLIER_5_STAR;
  }

  // Jika level tidak ada di tabel, cari level terdekat
  if (!multiplierTable[level]) {
    const levels = Object.keys(multiplierTable)
      .map(Number)
      .sort((a, b) => a - b);
    const closestLowerLevel = levels.filter((l) => l <= level).pop();
    const closestUpperLevel = levels.filter((l) => l >= level).shift();

    if (closestLowerLevel === closestUpperLevel) {
      return multiplierTable[closestLowerLevel][tier];
    }

    // Linear interpolation untuk level yang tidak ada di tabel
    const lowerMultiplier = multiplierTable[closestLowerLevel][tier];
    const upperMultiplier = multiplierTable[closestUpperLevel][tier];
    const ratio =
      (level - closestLowerLevel) / (closestUpperLevel - closestLowerLevel);
    return lowerMultiplier + (upperMultiplier - lowerMultiplier) * ratio;
  }

  return multiplierTable[level][tier];
};

// Table for Level multiplier untuk Secondary Attribute
const SECONDARY_LEVEL_MULTIPLIERS = {
  1: 1.0,
  5: 1.162,
  10: 1.363,
  15: 1.565,
  20: 1.767,
  25: 1.969,
  30: 2.171,
  35: 2.373,
  40: 2.575,
  45: 2.777,
  50: 2.979,
  55: 3.181,
  60: 3.383,
  65: 3.585,
  70: 3.786,
  75: 3.988,
  80: 4.19,
  85: 4.392,
  90: 4.594,
};

// Level multiplier untuk Secondary Attribute
const getSecondaryAttributeLevelMultiplier = (level) => {
  // Jika level ada di tabel, kembalikan langsung
  if (SECONDARY_LEVEL_MULTIPLIERS[level]) {
    return SECONDARY_LEVEL_MULTIPLIERS[level];
  }

  // Jika level tidak ada di tabel, gunakan interpolasi linear
  const levels = Object.keys(SECONDARY_LEVEL_MULTIPLIERS)
    .map(Number)
    .sort((a, b) => a - b);
  const closestLowerLevel = levels.filter((l) => l <= level).pop();
  const closestUpperLevel = levels.filter((l) => l >= level).shift();

  if (closestLowerLevel === closestUpperLevel) {
    return SECONDARY_LEVEL_MULTIPLIERS[closestLowerLevel];
  }

  const lowerMultiplier = SECONDARY_LEVEL_MULTIPLIERS[closestLowerLevel];
  const upperMultiplier = SECONDARY_LEVEL_MULTIPLIERS[closestUpperLevel];
  const ratio =
    (level - closestLowerLevel) / (closestUpperLevel - closestLowerLevel);
  return lowerMultiplier + (upperMultiplier - lowerMultiplier) * ratio;
};

// Mendapatkan ascension value berdasarkan raritas dan phase
const getAscensionValue = (rarity, ascension) => {
  if (!ASCENSION_VALUES[rarity] || ascension > 6) {
    return 0;
  }
  return ASCENSION_VALUES[rarity][ascension] || 0;
};

/**
 * Menghitung Base ATK senjata pada level dan ascension tertentu
 * @param {number} baseATK - Base ATK senjata pada level 1
 * @param {number} rarity - Raritas senjata (1-5)
 * @param {number} tier - Tier senjata dalam raritas (1-4)
 * @param {number} level - Level senjata
 * @param {number} ascension - Ascension phase (0-6)
 * @returns {number} - Nilai Base ATK pada level dan ascension tersebut
 */
function calculateBaseATK(baseATK, rarity, tier, level, ascension) {
  const levelMultiplier = getBaseATKLevelMultiplier(rarity, tier, level);
  const ascensionValue = getAscensionValue(rarity, ascension);

  const result = baseATK * levelMultiplier + ascensionValue;
  return Math.round(result);
}

/**
 * Menghitung nilai Secondary Attribute senjata
 * @param {number} baseValue - Nilai dasar substat pada level 1
 * @param {string} substType - Jenis substat (dari SUBSTAT_TYPES)
 * @param {number} level - Level senjata
 * @returns {number} - Nilai substat pada level tersebut
 */
function calculateSecondaryAttribute(baseValue, substType, level) {
  const levelMultiplier = getSecondaryAttributeLevelMultiplier(level);
  let result = baseValue * levelMultiplier;

  // Pembulatan berdasarkan jenis substat
  if (substType === SUBSTAT_TYPES.ELEMENTAL_MASTERY) {
    // EM adalah flat value, bulatkan ke bilangan bulat
    return Math.round(result);
  } else {
    // Percentage-based stats, bulatkan ke 1 desimal
    return Math.round(result * 10) / 10;
  }
}

/**
 * Generate semua stats senjata dari level 1-90
 * @param {number} weaponId - ID senjata di database
 * @param {string} weaponType - Tipe senjata (dari WEAPON_BASE_TYPES)
 * @param {number} baseSubstat - Nilai substat pada level 1
 * @param {string} substatType - Jenis substat (dari SUBSTAT_TYPES)
 * @returns {Array} - Array objek stats untuk setiap level dan ascension
 */
function generateAllWeaponStats(
  weaponId,
  weaponType,
  baseSubstat,
  substatType
) {
  if (!WEAPON_BASE_TYPES[weaponType]) {
    throw new Error(`Tipe senjata tidak valid: ${weaponType}`);
  }

  const { rarity, baseATK, tier } = WEAPON_BASE_TYPES[weaponType];

  // Jika senjata tidak memiliki substat (seperti beberapa senjata 1-2 bintang)
  const hasSubstat =
    baseSubstat !== undefined && baseSubstat !== null && substatType;

  // Generate stats untuk setiap kombinasi level dan ascension
  const allStats = [];

  LEVEL_ASCENSION_MAP.forEach(({ level, ascension }) => {
    // Skip level yang tidak relevan untuk raritas rendah
    if ((rarity === 1 || rarity === 2) && level > 70) return;

    // Hitung base ATK
    const baseAtkValue = calculateBaseATK(
      baseATK,
      rarity,
      tier,
      level,
      ascension
    );

    // Buat objek stat dasar
    const stat = {
      weapon_id: parseInt(weaponId),
      level,
      ascension,
      base_atk: baseAtkValue,
    };

    // Tambahkan substat jika ada
    if (hasSubstat) {
      stat.substat_type = substatType;
      stat.sub_stat_value = calculateSecondaryAttribute(
        baseSubstat,
        substatType,
        level
      );
    }

    allStats.push(stat);
  });

  return allStats;
}

/**
 * Generate stats senjata pada level dan ascension tertentu
 * @param {number} weaponId - ID senjata di database
 * @param {string} weaponType - Tipe senjata (dari WEAPON_BASE_TYPES)
 * @param {number} baseSubstat - Nilai substat pada level 1
 * @param {string} substatType - Jenis substat (dari SUBSTAT_TYPES)
 * @param {number} level - Level senjata yang diinginkan
 * @param {number} ascension - Ascension phase yang diinginkan
 * @returns {Object} - Objek stat untuk level dan ascension tersebut
 */
function generateWeaponStatForLevel(
  weaponId,
  weaponType,
  baseSubstat,
  substatType,
  level,
  ascension
) {
  if (!WEAPON_BASE_TYPES[weaponType]) {
    throw new Error(`Tipe senjata tidak valid: ${weaponType}`);
  }

  const { rarity, baseATK, tier } = WEAPON_BASE_TYPES[weaponType];

  // Hitung base ATK
  const baseAtkValue = calculateBaseATK(
    baseATK,
    rarity,
    tier,
    level,
    ascension
  );

  // Buat objek stat dasar
  const stat = {
    weapon_id: parseInt(weaponId) || 0,
    level,
    ascension,
    base_atk: baseAtkValue,
  };

  // Tambahkan substat jika ada
  if (baseSubstat !== undefined && baseSubstat !== null && substatType) {
    stat.substat_type = substatType;
    stat.sub_stat_value = calculateSecondaryAttribute(
      baseSubstat,
      substatType,
      level
    );
  }

  return stat;
}

/**
 * Menghitung scaling passive ability berdasarkan refinement
 * @param {number} baseEffect - Nilai efek pada R1
 * @param {number} refinement - Refinement level (1-5)
 * @param {number} incrementPercentage - Persentase peningkatan per refinement
 * @returns {number} - Nilai efek pada refinement tersebut
 */
function calculatePassiveEffect(baseEffect, refinement, incrementPercentage) {
  if (refinement < 1 || refinement > 5) {
    throw new Error("Refinement harus antara 1 dan 5");
  }

  // Contoh: Jika base effect 40% di R1 dan naik 10% per refinement
  // R1: 40%, R2: 50%, R3: 60%, dst.
  const increment = baseEffect * (incrementPercentage / 100);
  return baseEffect + increment * (refinement - 1);
}

// Nilai dasar substat untuk berbagai jenis
const BASE_SUBSTAT_VALUES = {
  ATK_PERCENT: {
    tier1: 3.0,
    tier2: 4.0,
    tier3: 6.0,
    tier4: 7.2,
    tier5: 10.8,
    tier6: 14.4,
  },
  HP_PERCENT: {
    tier1: 3.0,
    tier2: 4.0,
    tier3: 6.0,
    tier4: 7.2,
    tier5: 10.8,
    tier6: 14.4,
  },
  DEF_PERCENT: {
    tier1: 3.753,
    tier2: 7.506,
    tier3: 11.26,
    tier4: 15.013,
    tier5: 13.5,
    tier6: 18.0,
  },
  PHYSICAL_DMG_BONUS: {
    tier1: 3.753,
    tier2: 7.506,
    tier3: 11.26,
    tier4: 15.013,
    tier5: 13.5,
    tier6: 18.0,
  },
  ENERGY_RECHARGE: {
    tier1: 3.333,
    tier2: 6.666,
    tier3: 10.0,
    tier4: 13.333,
    tier5: 12.0,
    tier6: 16.0,
  },
  CRIT_RATE: {
    tier1: 2.0,
    tier2: 4.0,
    tier3: 6.0,
    tier4: 8.0,
    tier5: 7.2,
    tier6: 9.6,
  },
  CRIT_DMG: {
    tier1: 4.0,
    tier2: 8.0,
    tier3: 12.0,
    tier4: 16.0,
    tier5: 14.4,
    tier6: 19.2,
  },
  ELEMENTAL_MASTERY: {
    tier1: 12.0,
    tier2: 24.0,
    tier3: 36.0,
    tier4: 48.0,
    tier5: 43.2,
    tier6: 57.6,
  },
};

/**
 * Mendapatkan nilai dasar substat berdasarkan jenis dan tier
 * @param {string} substType - Jenis substat dari SUBSTAT_TYPES
 * @param {number} tier - Tier (1-6) untuk nilai substat
 * @returns {number} - Nilai dasar substat
 */
function getBaseSubstatValue(substType, tier) {
  if (!BASE_SUBSTAT_VALUES[substType]) {
    throw new Error(`Jenis substat tidak valid: ${substType}`);
  }

  const tierKey = `tier${tier}`;
  if (!BASE_SUBSTAT_VALUES[substType][tierKey]) {
    throw new Error(`Tier substat tidak valid: ${tier}`);
  }

  return BASE_SUBSTAT_VALUES[substType][tierKey];
}

module.exports = {
  WEAPON_BASE_TYPES,
  SUBSTAT_TYPES,
  LEVEL_ASCENSION_MAP,
  ASCENSION_VALUES,
  BASE_SUBSTAT_VALUES,
  calculateBaseATK,
  calculateSecondaryAttribute,
  generateAllWeaponStats,
  generateWeaponStatForLevel,
  calculatePassiveEffect,
  getBaseATKLevelMultiplier,
  getSecondaryAttributeLevelMultiplier,
  getAscensionValue,
  getBaseSubstatValue,
};
