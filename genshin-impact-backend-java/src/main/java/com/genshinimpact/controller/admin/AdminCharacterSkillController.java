package com.genshinimpact.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.character.BulkSkillsRequest;
import com.genshinimpact.dto.character.ConstellationRequest;
import com.genshinimpact.dto.character.PassiveRequest;
import com.genshinimpact.dto.character.TalentRequest;
import com.genshinimpact.model.CharacterConstellation;
import com.genshinimpact.model.CharacterPassive;
import com.genshinimpact.model.CharacterTalent;
import com.genshinimpact.service.CharacterSkillService;

@RestController
@RequestMapping("/api/admin/character")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCharacterSkillController {

    @Autowired
    private CharacterSkillService characterSkillService;
    
    @GetMapping("/{characterId}/talents")
    public ResponseEntity<ApiResponse<List<CharacterTalent>>> getCharacterTalents(@PathVariable int characterId) {
        try {
            List<CharacterTalent> talents = characterSkillService.getCharacterTalents(characterId);
            return ResponseEntity.ok(ApiResponse.success(talents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{characterId}/passives")
    public ResponseEntity<ApiResponse<List<CharacterPassive>>> getCharacterPassives(@PathVariable int characterId) {
        try {
            List<CharacterPassive> passives = characterSkillService.getCharacterPassives(characterId);
            return ResponseEntity.ok(ApiResponse.success(passives));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{characterId}/constellations")
    public ResponseEntity<ApiResponse<List<CharacterConstellation>>> getCharacterConstellations(@PathVariable int characterId) {
        try {
            List<CharacterConstellation> constellations = characterSkillService.getCharacterConstellations(characterId);
            return ResponseEntity.ok(ApiResponse.success(constellations));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{characterId}/talents")
    public ResponseEntity<ApiResponse<CharacterTalent>> addCharacterTalent(
            @PathVariable int characterId, @RequestBody TalentRequest request) {
        try {
            CharacterTalent talent = characterSkillService.addCharacterTalent(characterId, request);
            return ResponseEntity.ok(ApiResponse.success("Talent added successfully", talent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{characterId}/passives")
    public ResponseEntity<ApiResponse<CharacterPassive>> addCharacterPassive(
            @PathVariable int characterId, @RequestBody PassiveRequest request) {
        try {
            CharacterPassive passive = characterSkillService.addCharacterPassive(characterId, request);
            return ResponseEntity.ok(ApiResponse.success("Passive added successfully", passive));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{characterId}/constellations")
    public ResponseEntity<ApiResponse<CharacterConstellation>> addCharacterConstellation(
            @PathVariable int characterId, @RequestBody ConstellationRequest request) {
        try {
            CharacterConstellation constellation = characterSkillService.addCharacterConstellation(characterId, request);
            return ResponseEntity.ok(ApiResponse.success("Constellation added successfully", constellation));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{characterId}/bulk-skills")
    public ResponseEntity<?> bulkAddCharacterSkills(
            @PathVariable int characterId, @RequestBody BulkSkillsRequest request) {
        try {
            CharacterSkillService.BulkSkillsResult result = characterSkillService.bulkAddCharacterSkills(characterId, request);
            return ResponseEntity.ok(ApiResponse.success("Character skills added successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}