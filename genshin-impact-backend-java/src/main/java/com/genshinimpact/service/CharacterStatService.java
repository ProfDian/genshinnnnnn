package com.genshinimpact.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.constant.StatConstants;
import com.genshinimpact.dto.character.StatBaseRequest;
import com.genshinimpact.dto.character.StatPreviewRequest;
import com.genshinimpact.dto.character.StatPreviewResponse;
import com.genshinimpact.model.Character;
import com.genshinimpact.model.CharacterStat;
import com.genshinimpact.repository.CharacterRepository;
import com.genshinimpact.repository.CharacterStatRepository;
import com.genshinimpact.util.StatCalculator;

@Service
public class CharacterStatService {

    @Autowired
    private CharacterRepository characterRepository;
    
    @Autowired
    private CharacterStatRepository characterStatRepository;
    
    /**
     * Mendapatkan semua stat untuk karakter tertentu
     */
    public List<CharacterStat> getCharacterStats(int characterId) {
        return characterStatRepository.findByCharacterIdOrderByAscensionAscLevelAsc(characterId);
    }
    
    /**
     * Mendapatkan semua jenis stat yang tersedia
     */
    public List<Map<String, Object>> getStatTypes() {
        List<Map<String, Object>> statTypes = new ArrayList<>();
        
        // Reflection untuk mendapatkan semua konstanta dari StatType
        try {
            for (java.lang.reflect.Field field : StatConstants.StatType.class.getDeclaredFields()) {
                if (java.lang.reflect.Modifier.isStatic(field.getModifiers()) && 
                    java.lang.reflect.Modifier.isFinal(field.getModifiers())) {
                    
                    String value = (String) field.get(null);
                    String label = field.getName().replace("_", " ").replace("PERCENT", "%");
                    
                    Map<String, Object> type = new java.util.HashMap<>();
                    type.put("value", value);
                    type.put("label", label);
                    
                    statTypes.add(type);
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Error getting stat types", e);
        }
        
        return statTypes;
    }
    
    /**
     * Menambahkan stats untuk karakter berdasarkan stats level 1 dan max ascension values
     */
    @Transactional
    public List<CharacterStat> addCharacterStats(int characterId, StatBaseRequest request) {
        // Validasi input
        if (request.getStatType() == null || request.getBaseStats() == null || 
            request.getMaxAscensionValues() == null) {
            throw new IllegalArgumentException("Stat type, base stats, and max ascension values are required");
        }
        
        StatBaseRequest.BaseStats baseStats = request.getBaseStats();
        if (baseStats.getHp() <= 0 || baseStats.getAtk() <= 0 || baseStats.getDef() <= 0) {
            throw new IllegalArgumentException("Base stats (HP, ATK, DEF) must be positive");
        }
        
        StatBaseRequest.MaxAscensionValues maxValues = request.getMaxAscensionValues();
        if (maxValues.getHp() <= 0 || maxValues.getAtk() <= 0 || maxValues.getDef() <= 0) {
            throw new IllegalArgumentException("Max ascension values (HP, ATK, DEF) must be positive");
        }
        
        // Mendapatkan rarity karakter
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found with id: " + characterId));
        
        Integer rarityValue = character.getRarity() != null ? character.getRarity().getRarityValue() : null;
        
        if (rarityValue == null || (rarityValue != 4 && rarityValue != 5)) {
            throw new IllegalArgumentException("Character must have rarity 4 or 5 for ascension stats");
        }
        
        // Hapus stats lama jika ada
        characterStatRepository.deleteByCharacterId(characterId);
        
        // Generate stats baru
        List<CharacterStat> statsData = generateAllCharacterStats(
                characterId, 
                request.getStatType(), 
                rarityValue, 
                request.getBaseStats(), 
                request.getMaxAscensionValues());
        
        // Simpan ke database
        return characterStatRepository.saveAll(statsData);
    }
    
    /**
     * Preview stats karakter tanpa menyimpan ke database
     */
    public List<StatPreviewResponse> previewCharacterStats(StatPreviewRequest request) {
        // Validasi input
        if (request.getStatType() == null || request.getRarityValue() <= 0 || 
            request.getBaseStats() == null || request.getMaxAscensionValues() == null) {
            throw new IllegalArgumentException("Stat type, rarity value, base stats, and max ascension values are required");
        }
        
        if (request.getRarityValue() != 4 && request.getRarityValue() != 5) {
            throw new IllegalArgumentException("Rarity value must be 4 or 5");
        }
        
        // Level untuk preview
        List<StatConstants.LevelAscension> previewLevels = StatConstants.LEVEL_ASCENSION_MAP;
        
        // Generate preview stats
        List<StatPreviewResponse> previewStats = previewLevels.stream()
                .map(la -> {
                    CharacterStat stat = generateCharacterStatForLevel(
                            0, // dummy ID
                            request.getStatType(), 
                            request.getRarityValue(), 
                            request.getBaseStats(), 
                            request.getMaxAscensionValues(), 
                            la.getLevel(), 
                            la.getAscension());
                    
                    double displayStatValue = StatCalculator.getTotalStatValueForDisplay(
                            request.getStatType(), 
                            stat.getStatValue());
                    
                    return new StatPreviewResponse(
                            stat.getLevel(),
                            stat.getAscension(),
                            stat.getHp(),
                            stat.getBaseAtk(),
                            stat.getDef(),
                            stat.getStatType(),
                            stat.getStatValue(),
                            displayStatValue
                    );
                })
                .collect(Collectors.toList());
        
        return previewStats;
    }
    
    /**
     * Generate semua stats karakter untuk setiap level dan ascension
     */
    private List<CharacterStat> generateAllCharacterStats(
            int characterId,
            String statType,
            int rarity,
            StatBaseRequest.BaseStats baseStats,
            StatBaseRequest.MaxAscensionValues maxAscensionValues) {
        
        List<CharacterStat> allStats = new ArrayList<>();
        
        for (StatConstants.LevelAscension la : StatConstants.LEVEL_ASCENSION_MAP) {
            CharacterStat stat = generateCharacterStatForLevel(
                    characterId,
                    statType,
                    rarity,
                    baseStats,
                    maxAscensionValues,
                    la.getLevel(),
                    la.getAscension());
            
            allStats.add(stat);
        }
        
        return allStats;
    }
    
/**
 * Generate stat karakter untuk level dan ascension tertentu
 */
private CharacterStat generateCharacterStatForLevel(
        int characterId,
        String statType,
        int rarity,
        StatBaseRequest.BaseStats baseStats,
        StatBaseRequest.MaxAscensionValues maxAscensionValues,
        int level,
        int ascension) {
    
    // Hitung stats dasar
    Map<String, Double> stats = StatCalculator.calculateCharacterStats(
            baseStats,
            rarity,
            maxAscensionValues,
            level,
            ascension);
    
    // Hitung stat bonus
    double bonusStatValue = StatCalculator.calculateBonusStat(statType, rarity, ascension);
    
    // Buat objek CharacterStat
    CharacterStat characterStat = new CharacterStat();
    characterStat.setCharacterId(characterId);
    characterStat.setLevel(level);
    characterStat.setAscension(ascension);
    
    // Konversi double/Double ke Float secara eksplisit
    characterStat.setHp(stats.get("hp").floatValue());
    characterStat.setBaseAtk(stats.get("atk").floatValue());
    characterStat.setDef(stats.get("def").floatValue());
    characterStat.setStatType(statType);
    characterStat.setStatValue((float) bonusStatValue);
    
    return characterStat;
}
    
    /**
     * Mendapatkan map level ascension
     */
    public List<StatConstants.LevelAscension> getLevelAscensionMap() {
        return StatConstants.LEVEL_ASCENSION_MAP;
    }
    
    /**
     * Mendapatkan nilai base untuk stat bonus
     */
    public Map<String, Double> getBaseStatValues() {
        return StatConstants.BASE_STAT_VALUES;
    }
}