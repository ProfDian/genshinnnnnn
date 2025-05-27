package com.genshinimpact.dto.character;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkSkillsRequest {
    private List<TalentRequest> talents;
    private List<PassiveRequest> passives;
    private List<ConstellationRequest> constellations;
}