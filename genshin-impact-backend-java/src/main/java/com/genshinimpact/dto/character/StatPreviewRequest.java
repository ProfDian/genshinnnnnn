package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatPreviewRequest {
    private String statType;
    private int rarityValue;
    private StatBaseRequest.BaseStats baseStats;
    private StatBaseRequest.MaxAscensionValues maxAscensionValues;
}