package com.genshinimpact.util;

import com.genshinimpact.constant.StatConstants;
import com.genshinimpact.dto.character.StatBaseRequest;

import java.util.HashMap;
import java.util.Map;

public class StatCalculator {
    
    /**
     * Menghitung multiplier berdasarkan level untuk 4* dan 5*
     */
    public static double getLevelMultiplier(int level, int rarity) {
        // Base multiplier calculation
        double baseMultiplier = 1 + ((9.17431 - 1) / (100 - 1)) * (level - 1);
        
        if (rarity == 4) {
            // Round to 3 decimal places for 4-star characters
            return Math.round(baseMultiplier * 1000) / 1000.0;
        } else if (rarity == 5) {
            // 5-star character formula with correction factor
            double correction = -0.00168 + 0.0000748163 * Math.pow(0.761486 * (5.11365 + level), 2);
            return Math.round((baseMultiplier + correction) * 1000) / 1000.0;
        }
        
        // Default fallback to base multiplier if rarity unknown
        return baseMultiplier;
    }
    
    /**
     * Mendapatkan ascension multiplier untuk base stats (HP, ATK, DEF)
     */
    public static double getBaseStatAscensionMultiplier(int ascension) {
        if (ascension < 0 || ascension >= StatConstants.BASE_STAT_ASCENSION_MULTIPLIERS.length) {
            return 0;
        }
        return StatConstants.BASE_STAT_ASCENSION_MULTIPLIERS[ascension];
    }
    
    /**
     * Mendapatkan ascension multiplier untuk bonus stats
     */
    public static int getBonusStatAscensionMultiplier(int ascension) {
        if (ascension < 0 || ascension >= StatConstants.BONUS_STAT_ASCENSION_MULTIPLIERS.length) {
            return 0;
        }
        return StatConstants.BONUS_STAT_ASCENSION_MULTIPLIERS[ascension];
    }
    
    /**
     * Mendapatkan base value untuk bonus stats berdasarkan jenis dan rarity
     */
    public static double getBonusStatBaseValue(String statType, int rarity) {
        Map<String, Double> values5Star = new HashMap<String, Double>() {{
            put(StatConstants.StatType.CRIT_RATE, 4.8);
            put(StatConstants.StatType.CRIT_DMG, 9.6);
            put(StatConstants.StatType.ATK_PERCENT, 7.2);
            put(StatConstants.StatType.HP_PERCENT, 7.2);
            put(StatConstants.StatType.DEF_PERCENT, 9.0);
            put(StatConstants.StatType.PHYSICAL_DMG, 9.0);
            put(StatConstants.StatType.PYRO_DMG, 7.2);
            put(StatConstants.StatType.HYDRO_DMG, 7.2);
            put(StatConstants.StatType.CRYO_DMG, 7.2);
            put(StatConstants.StatType.ELECTRO_DMG, 7.2);
            put(StatConstants.StatType.ANEMO_DMG, 7.2);
            put(StatConstants.StatType.GEO_DMG, 7.2);
            put(StatConstants.StatType.DENDRO_DMG, 7.2);
            put(StatConstants.StatType.ENERGY_RECHARGE, 8.0);
            put(StatConstants.StatType.ELEMENTAL_MASTERY, 28.8);
            put(StatConstants.StatType.HEALING_BONUS, 5.5);
        }};
        
        Map<String, Double> values4Star = new HashMap<String, Double>() {{
            put(StatConstants.StatType.CRIT_RATE, 4.0);
            put(StatConstants.StatType.CRIT_DMG, 8.0);
            put(StatConstants.StatType.ATK_PERCENT, 6.0);
            put(StatConstants.StatType.HP_PERCENT, 6.0);
            put(StatConstants.StatType.DEF_PERCENT, 7.5);
            put(StatConstants.StatType.PHYSICAL_DMG, 7.5);
            put(StatConstants.StatType.PYRO_DMG, 6.0);
            put(StatConstants.StatType.HYDRO_DMG, 6.0);
            put(StatConstants.StatType.CRYO_DMG, 6.0);
            put(StatConstants.StatType.ELECTRO_DMG, 6.0);
            put(StatConstants.StatType.ANEMO_DMG, 6.0);
            put(StatConstants.StatType.GEO_DMG, 6.0);
            put(StatConstants.StatType.DENDRO_DMG, 6.0);
            put(StatConstants.StatType.ENERGY_RECHARGE, 6.7);
            put(StatConstants.StatType.ELEMENTAL_MASTERY, 24.0);
        }};
        
        if (rarity == 5 && values5Star.containsKey(statType)) {
            return values5Star.get(statType);
        } else if (rarity == 4 && values4Star.containsKey(statType)) {
            return values4Star.get(statType);
        }
        
        return 0.0;
    }
    
    /**
     * Menghitung stats karakter (HP, ATK, DEF) pada level dan ascension tertentu
     */
    public static Map<String, Double> calculateCharacterStats(
            StatBaseRequest.BaseStats baseStats,
            int rarity,
            StatBaseRequest.MaxAscensionValues maxAscensionValues,
            int level,
            int ascension) {
        
        double levelMultiplier = getLevelMultiplier(level, rarity);
        double ascensionMultiplier = getBaseStatAscensionMultiplier(ascension);
        
        double hp = baseStats.getHp() * levelMultiplier + 
                maxAscensionValues.getHp() * ascensionMultiplier;
        double atk = baseStats.getAtk() * levelMultiplier + 
                maxAscensionValues.getAtk() * ascensionMultiplier;
        double def = baseStats.getDef() * levelMultiplier + 
                maxAscensionValues.getDef() * ascensionMultiplier;
        
        Map<String, Double> result = new HashMap<>();
        result.put("hp", Math.round(hp * 10) / 10.0); // Round to 1 decimal place
        result.put("atk", Math.round(atk * 10) / 10.0); // Round to 1 decimal place
        result.put("def", Math.round(def * 10) / 10.0); // Round to 1 decimal place
        
        return result;
    }
    
    /**
     * Menghitung stat bonus karakter pada ascension tertentu
     */
    public static double calculateBonusStat(String statType, int rarity, int ascension) {
        double baseValue = getBonusStatBaseValue(statType, rarity);
        int multiplier = getBonusStatAscensionMultiplier(ascension);
        
        // Hanya return nilai bonus dari ascension, tanpa nilai dasar
        return Math.round(baseValue * multiplier * 10) / 10.0; // Round to 1 decimal place
    }
    
    /**
     * Mendapatkan nilai total stat (termasuk nilai dasar) untuk tampilan
     */
    public static double getTotalStatValueForDisplay(String statType, double bonusValue) {
        // Tambahkan nilai dasar jika statType memiliki nilai dasar
        if (StatConstants.BASE_STAT_VALUES.containsKey(statType)) {
            return StatConstants.BASE_STAT_VALUES.get(statType) + bonusValue;
        }
        return bonusValue;
    }
}