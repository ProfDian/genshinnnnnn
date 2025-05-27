package com.genshinimpact.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.genshinimpact.model.Region;
import com.genshinimpact.model.RegionArea;
import com.genshinimpact.model.RegionFeature;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionResponse {
    private Integer id;
    private String regionName;
    private String overview;
    private String worldMap;
    private String archonQuest;
    private String associatedElement;
    private String archon;
    private String ideal;
    private String mainCity;
    private String controllingEntity;
    private String celebratedFestivals;
    private String howToAccess;
    private String regionIcon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested DTO for region areas
    private List<RegionAreaDto> areas;
    
    // Nested DTO for region features
    private List<RegionFeatureDto> features;
    
    // Static method to convert from Entity to DTO
    public static RegionResponse fromEntity(Region region) {
        RegionResponse response = new RegionResponse();
        response.setId(region.getId());
        response.setRegionName(region.getRegionName());
        response.setOverview(region.getOverview());
        response.setWorldMap(region.getWorldMap());
        response.setArchonQuest(region.getArchonQuest());
        response.setAssociatedElement(region.getAssociatedElement());
        response.setArchon(region.getArchon());
        response.setIdeal(region.getIdeal());
        response.setMainCity(region.getMainCity());
        response.setControllingEntity(region.getControllingEntity());
        response.setCelebratedFestivals(region.getCelebratedFestivals());
        response.setHowToAccess(region.getHowToAccess());
        response.setRegionIcon(region.getRegionIcon());
        response.setCreatedAt(region.getCreatedAt());
        response.setUpdatedAt(region.getUpdatedAt());
        
        // Convert area entities to DTOs if they exist
        if (region.getAreas() != null) {
            response.setAreas(region.getAreas().stream()
                .map(RegionAreaDto::fromEntity)
                .collect(Collectors.toList()));
        }
        
        // Convert feature entities to DTOs if they exist
        if (region.getFeatures() != null) {
            response.setFeatures(region.getFeatures().stream()
                .map(RegionFeatureDto::fromEntity)
                .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    // Nested DTO class for Region Areas
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionAreaDto {
        private Integer id;
        private String areaName;
        private String areaDescription;
        private String areaImage;
        
        public static RegionAreaDto fromEntity(RegionArea area) {
            RegionAreaDto dto = new RegionAreaDto();
            dto.setId(area.getId());
            dto.setAreaName(area.getAreaName());
            dto.setAreaDescription(area.getAreaDescription());
            dto.setAreaImage(area.getAreaImage());
            return dto;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionFeatureDto {
        private Integer id;
        private String featureName;
        private String featureDescription;
        
        public static RegionFeatureDto fromEntity(RegionFeature feature) {
            RegionFeatureDto dto = new RegionFeatureDto();
            dto.setId(feature.getId());
            dto.setFeatureName(feature.getFeatureName());
            dto.setFeatureDescription(feature.getFeatureDescription());
            return dto;
        }
    }
}