package com.genshinimpact.constant;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StatConstants {
    
    // Jenis-jenis stat bonus
    public static class StatType {
        public static final String CRIT_RATE = "CRIT_RATE";
        public static final String CRIT_DMG = "CRIT_DMG";
        public static final String ATK_PERCENT = "ATK_PERCENT";
        public static final String HP_PERCENT = "HP_PERCENT";
        public static final String DEF_PERCENT = "DEF_PERCENT";
        public static final String ENERGY_RECHARGE = "ENERGY_RECHARGE";
        public static final String ELEMENTAL_MASTERY = "ELEMENTAL_MASTERY";
        public static final String HEALING_BONUS = "HEALING_BONUS";
        public static final String PHYSICAL_DMG = "PHYSICAL_DMG";
        public static final String PYRO_DMG = "PYRO_DMG";
        public static final String HYDRO_DMG = "HYDRO_DMG";
        public static final String CRYO_DMG = "CRYO_DMG";
        public static final String ELECTRO_DMG = "ELECTRO_DMG";
        public static final String ANEMO_DMG = "ANEMO_DMG";
        public static final String GEO_DMG = "GEO_DMG";
        public static final String DENDRO_DMG = "DENDRO_DMG";
    }
    
    // Nilai dasar untuk stats tertentu
    public static final Map<String, Double> BASE_STAT_VALUES = new HashMap<String, Double>() {{
        put(StatType.CRIT_RATE, 5.0); // 5%
        put(StatType.CRIT_DMG, 50.0); // 50%
        put(StatType.ENERGY_RECHARGE, 100.0); // 100%
    }};
    
    // Level dan ascension phase
    public static final List<LevelAscension> LEVEL_ASCENSION_MAP = Arrays.asList(
        new LevelAscension(1, 0),
        new LevelAscension(20, 0),
        new LevelAscension(20, 1),  // Setelah ascension pertama
        new LevelAscension(40, 1),
        new LevelAscension(40, 2),  // Setelah ascension kedua
        new LevelAscension(50, 2),
        new LevelAscension(50, 3),  // Setelah ascension ketiga
        new LevelAscension(60, 3),
        new LevelAscension(60, 4),  // Setelah ascension keempat
        new LevelAscension(70, 4),
        new LevelAscension(70, 5),  // Setelah ascension kelima
        new LevelAscension(80, 5),
        new LevelAscension(80, 6),  // Setelah ascension keenam
        new LevelAscension(90, 6)
    );
    
    // Ascension multiplier untuk base stats (HP, ATK, DEF)
    public static final double[] BASE_STAT_ASCENSION_MULTIPLIERS = {
        0,
        38.0 / 182.0,
        65.0 / 182.0,
        101.0 / 182.0,
        128.0 / 182.0,
        155.0 / 182.0,
        182.0 / 182.0
    };
    
    // Ascension multiplier untuk bonus stats (CRIT, DMG Bonus, dll)
    public static final int[] BONUS_STAT_ASCENSION_MULTIPLIERS = {0, 0, 1, 2, 2, 3, 4};
    
    // Helper class untuk pasangan level dan ascension
    public static class LevelAscension {
        private final int level;
        private final int ascension;
        
        public LevelAscension(int level, int ascension) {
            this.level = level;
            this.ascension = ascension;
        }
        
        public int getLevel() {
            return level;
        }
        
        public int getAscension() {
            return ascension;
        }
    }
}