package com.genshinimpact.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.constant.StatConstants;
import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.character.StatBaseRequest;
import com.genshinimpact.dto.character.StatPreviewRequest;
import com.genshinimpact.dto.character.StatPreviewResponse;
import com.genshinimpact.model.CharacterStat;
import com.genshinimpact.service.CharacterStatService;

@RestController
@RequestMapping("/api/admin/character")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCharacterStatController {

    @Autowired
    private CharacterStatService characterStatService;
    
    @GetMapping("/{characterId}/stats")
    public ResponseEntity<ApiResponse<List<CharacterStat>>> getCharacterStats(@PathVariable int characterId) {
        try {
            List<CharacterStat> stats = characterStatService.getCharacterStats(characterId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{characterId}/stats")
    public ResponseEntity<ApiResponse<List<CharacterStat>>> addCharacterStats(
            @PathVariable int characterId, @RequestBody StatBaseRequest request) {
        try {
            List<CharacterStat> stats = characterStatService.addCharacterStats(characterId, request);
            return ResponseEntity.ok(ApiResponse.success("Character stats added successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/stats/preview")
    public ResponseEntity<ApiResponse<List<StatPreviewResponse>>> previewCharacterStats(
            @RequestBody StatPreviewRequest request) {
        try {
            List<StatPreviewResponse> previewStats = characterStatService.previewCharacterStats(request);
            return ResponseEntity.ok(ApiResponse.success(previewStats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStatTypes() {
        try {
            List<Map<String, Object>> statTypes = characterStatService.getStatTypes();
            return ResponseEntity.ok(ApiResponse.success(statTypes));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/level-map")
    public ResponseEntity<ApiResponse<List<StatConstants.LevelAscension>>> getLevelAscensionMap() {
        try {
            List<StatConstants.LevelAscension> levelMap = characterStatService.getLevelAscensionMap();
            return ResponseEntity.ok(ApiResponse.success(levelMap));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/base-values")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getBaseStatValues() {
        try {
            Map<String, Double> baseValues = characterStatService.getBaseStatValues();
            return ResponseEntity.ok(ApiResponse.success(baseValues));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}