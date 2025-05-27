package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatPreviewResponse {
    private int level;
    private int ascension;
    private double hp;
    private double baseAtk;
    private double def;
    private String statType;
    private double statValue;
    private double displayStatValue;
}