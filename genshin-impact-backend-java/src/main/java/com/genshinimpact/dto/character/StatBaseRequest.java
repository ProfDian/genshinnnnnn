package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class StatBaseRequest {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaseStats {
        private double hp;
        private double atk;
        private double def;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaxAscensionValues {
        private double hp;
        private double atk;
        private double def;
    }
    
    private String statType;
    private BaseStats baseStats;
    private MaxAscensionValues maxAscensionValues;
    
    public StatBaseRequest() {
    }
    
    public StatBaseRequest(String statType, BaseStats baseStats, MaxAscensionValues maxAscensionValues) {
        this.statType = statType;
        this.baseStats = baseStats;
        this.maxAscensionValues = maxAscensionValues;
    }
    
    public String getStatType() {
        return statType;
    }
    
    public void setStatType(String statType) {
        this.statType = statType;
    }
    
    public BaseStats getBaseStats() {
        return baseStats;
    }
    
    public void setBaseStats(BaseStats baseStats) {
        this.baseStats = baseStats;
    }
    
    public MaxAscensionValues getMaxAscensionValues() {
        return maxAscensionValues;
    }
    
    public void setMaxAscensionValues(MaxAscensionValues maxAscensionValues) {
        this.maxAscensionValues = maxAscensionValues;
    }
}