package com.genshinimpact.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.RegionResponse;
import com.genshinimpact.model.Character;
import com.genshinimpact.model.Region;
import com.genshinimpact.model.RegionArea;
import com.genshinimpact.model.RegionFeature;
import com.genshinimpact.repository.CharacterRepository;
import com.genshinimpact.repository.RegionAreaRepository;
import com.genshinimpact.repository.RegionFeatureRepository;
import com.genshinimpact.repository.RegionRepository;

@RestController
@RequestMapping("/api/regions")
public class RegionController {

    @Autowired
    private RegionRepository regionRepository;
    
    @Autowired
    private RegionAreaRepository regionAreaRepository;
    
    @Autowired
    private RegionFeatureRepository regionFeatureRepository;
    
    @Autowired
    private CharacterRepository characterRepository;
    
    /**
     * Get all regions (basic data only)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegionResponse>>> getAllRegions() {
        try {
            List<Region> regions = regionRepository.findAll(Sort.by("id"));
            
            List<RegionResponse> response = regions.stream()
                .map(region -> {
                    // Create simplified RegionResponse without areas and features
                    RegionResponse dto = RegionResponse.fromEntity(region);
                    dto.setAreas(null);
                    dto.setFeatures(null);
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success("Regions retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error fetching regions: " + e.getMessage()));
        }
    }
    
    /**
     * Get region by ID with detailed information (areas and features)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegionResponse>> getRegionById(@PathVariable Integer id) {
        try {
            Optional<Region> regionOptional = regionRepository.findById(id);
            
            if (regionOptional.isPresent()) {
                Region region = regionOptional.get();
                
                // Load areas and features
                List<RegionArea> areas = regionAreaRepository.findByRegionIdAndDeletedAtIsNull(region.getId());
                List<RegionFeature> features = regionFeatureRepository.findByRegionId(region.getId());
                
                // Set areas and features to the region entity
                region.setAreas(areas);
                region.setFeatures(features);
                
                // Convert to DTO
                RegionResponse regionResponse = RegionResponse.fromEntity(region);
                
                return ResponseEntity.ok(ApiResponse.success("Region retrieved successfully", regionResponse));
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Region not found"));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error fetching region: " + e.getMessage()));
        }
    }
    

/**
 * Get characters by region ID
 */
@GetMapping("/{id}/characters")
public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCharactersByRegion(@PathVariable Integer id) {
    try {
        // First, check if the region exists
        if (!regionRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Region not found"));
        }
        
        // Find all non-deleted characters with the specified region ID
        List<Character> characters = characterRepository.findActiveCharactersByRegionId(id);
        
        // Convert entities to simplified maps to prevent circular references
        List<Map<String, Object>> characterResponses = characters.stream()
            .map(character -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", character.getId());
                map.put("name", character.getName());
                map.put("title", character.getTitle());
                map.put("detail", character.getDetail());
                map.put("constellation", character.getConstellation());
                map.put("icon", character.getIcon());
                map.put("gachaImg", character.getGachaImg());
                map.put("birthday", character.getBirthday());
                map.put("releaseDate", character.getReleaseDate());
                map.put("element", character.getElement());
                map.put("weaponType", character.getWeaponType());
                map.put("regionId", character.getRegionId());
                if (character.getRegion() != null) {
                    map.put("regionName", character.getRegion().getRegionName());
                }
                map.put("rarity", character.getRarity());
                return map;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success("Characters retrieved successfully", characterResponses));
    } catch (Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error fetching characters: " + e.getMessage()));
    }
}
}