package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConstellationRequest {
    private int constellationLevel;
    private String constellationName;
    private String constellationDescription;
    private String constellationIcon;
}