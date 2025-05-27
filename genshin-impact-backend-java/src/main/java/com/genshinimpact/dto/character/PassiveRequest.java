package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassiveRequest {
    private int passiveOrder;
    private String passiveName;
    private String passiveDescription;
    private Integer unlockLevel;
}